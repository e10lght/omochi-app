import dayjs from "dayjs";
import { Between, LessThan, MoreThanOrEqual, Repository } from "typeorm";
import { Meals } from "../models/Meals.model";
import { v4 as uuidv4 } from "uuid";
import { isValidDate } from "../utils/util";

export class MealsService {
  constructor(private readonly mealsRepository: Repository<Meals>) {}

  async getTodayMeal(): Promise<{
    result: boolean;
    data: Meals | null;
    message: string | null;
  }> {
    try {
      const today = dayjs().startOf("day").toDate();
      const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

      const todayMeal = await this.mealsRepository.findOne({
        where: [
          { createdat: MoreThanOrEqual(today) },
          { createdat: LessThan(tomorrow) },
        ],
      });
      if (!todayMeal) throw new Error("今日はまだ食事をしていません！");

      return { result: true, data: todayMeal, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, data: null, message: error.message };
      }
      console.error(error);
      return { result: false, data: null, message: "不具合が発生" };
    }
  }

  async getMonthlyMeals(date: string): Promise<{
    result: boolean;
    data: Meals[];
    message: string | null;
  }> {
    try {
      if (!isValidDate(date)) throw new Error("正しい日付を入力してください！");

      const startDate = dayjs(date).startOf("month").toDate();
      const endDate = dayjs(date).endOf("month").toDate();

      const meals = await this.mealsRepository.find({
        where: {
          createdat: Between(startDate, endDate),
        },
      });
      if (!meals) throw new Error("食事のデータがありません！");

      return { result: true, data: meals, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, data: [], message: error.message };
      }
      console.error(error);
      return { result: false, data: [], message: "不具合が発生" };
    }
  }

  async createMeal(
    timeOfDay: "朝" | "夜",
    status: string,
    userid: string
  ): Promise<{
    result: boolean;
    createdMeal: Meals | null;
    message: string;
  }> {
    try {
      if (!(timeOfDay === "朝" || timeOfDay === "夜")) {
        throw new Error("timeOfDayには「朝」または「夜」を指定してください");
      }
      const meal = new Meals();
      meal.mealid = uuidv4();
      meal.status = status;
      meal.timeofday = timeOfDay;
      meal.userid = userid;

      const createdMeal = await this.mealsRepository.save(meal);
      if (!createdMeal) {
        throw new Error("食事データを登録できませんでした");
      }

      return {
        result: true,
        createdMeal,
        message: "食事データを登録しました！",
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return {
          result: false,
          createdMeal: null,
          message: error.message,
        };
      }
      console.error(error);
      return { result: false, createdMeal: null, message: "不具合が発生" };
    }
  }
}
