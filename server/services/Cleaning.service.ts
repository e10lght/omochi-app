import dayjs from "dayjs";
import { Between, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Cleaning } from "../models/Cleaning.model";
import { isValidDate } from "../utils/util";

export class CleaningService {
  constructor(private readonly cleaningRepository: Repository<Cleaning>) {}

  async getTodayCleaning(): Promise<{
    result: boolean;
    todayCleaning: Cleaning | null;
    message: string | null;
  }> {
    try {
      // dayjsはUTCで取得する（日本標準時はUTC+9）
      const today = dayjs().startOf("day").toDate();
      console.log(dayjs());
      console.log(dayjs().startOf("day"));
      console.log(today);
      const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

      const todayCleaning = await this.cleaningRepository.findOne({
        where: {
          createdat: Between(today, tomorrow),
        },
      });
      console.log(todayCleaning);
      if (!todayCleaning) throw new Error("今日はまだ掃除をしていません！");

      return { result: true, todayCleaning, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, todayCleaning: null, message: error.message };
      }
      console.error(error);
      return { result: false, todayCleaning: null, message: "不具合が発生" };
    }
  }

  async getMonthlyMeals(date: string): Promise<{
    result: boolean;
    monthlyCleaning: Cleaning[];
    message: string | null;
  }> {
    try {
      if (!isValidDate(date)) throw new Error("正しい日付を入力してください！");

      const startDate = dayjs(date)
        .startOf("month")
        .subtract(9, "hours")
        .toDate();
      const endDate = dayjs(date).endOf("month").subtract(9, "hours").toDate();

      const monthlyCleaning = await this.cleaningRepository.find({
        where: {
          createdat: Between(startDate, endDate),
        },
      });
      if (!monthlyCleaning) throw new Error("食事のデータがありません！");

      return { result: true, monthlyCleaning, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, monthlyCleaning: [], message: error.message };
      }
      console.error(error);
      return { result: false, monthlyCleaning: [], message: "不具合が発生" };
    }
  }

  async createCleaning(
    status: string,
    userid: string
  ): Promise<{
    result: boolean;
    createdCleaning: Cleaning | null;
    message: string | null;
  }> {
    try {
      const cleaning = new Cleaning();
      cleaning.cleaningid = uuidv4();
      cleaning.status = status;
      cleaning.userid = userid;
      cleaning.timeofday = "";

      const createdCleaning = await this.cleaningRepository.save(cleaning);
      if (!createdCleaning) {
        throw new Error("掃除データを登録できませんでした");
      }

      return {
        result: true,
        createdCleaning,
        message: "掃除データを登録しました！",
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return {
          result: false,
          createdCleaning: null,
          message: error.message,
        };
      }
      console.error(error);
      return { result: false, createdCleaning: null, message: "不具合が発生" };
    }
  }
}
