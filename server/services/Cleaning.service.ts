import dayjs from "dayjs";
import { Between, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Cleaning } from "../models/Cleaning.model";
import { isValidDate, setToFifteen } from "../utils/util";

export class CleaningService {
  constructor(private readonly cleaningRepository: Repository<Cleaning>) {}

  async getTodayCleaning(): Promise<{
    result: boolean;
    todayCleaning: Cleaning | null;
    message: string | null;
  }> {
    try {
      const today = dayjs().format("YYYY/M/D");
      const todayCleaning = await this.cleaningRepository.findOne({
        where: {
          createdDate: today,
        },
      });
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

      const today = dayjs(date).format("YYYY/M/");
      const monthlyCleaning = await this.cleaningRepository
        .createQueryBuilder("cleaning")
        .where("cleaning.createdDate like :createdDate", {
          createdDate: `${today}%`,
        })
        .getMany();
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
      cleaning.createdDate = dayjs().format("YYYY/M/D");

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
