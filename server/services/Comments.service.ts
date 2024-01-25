import dayjs from "dayjs";
import { Between, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Comments } from "../models/Comments.model";
import { isValidDate } from "../utils/util";

export class CommentsService {
  constructor(private readonly commentsRepository: Repository<Comments>) {}

  async getTodayComments(): Promise<{
    result: boolean;
    todayComments: Comments[] | null;
    message: string | null;
  }> {
    try {
      const today = dayjs()
        .startOf("day")
        .startOf("day")
        .subtract(9, "hours")
        .toDate();
      const tomorrow = dayjs()
        .add(1, "day")
        .startOf("day")
        .subtract(9, "hours")
        .toDate();

      const todayComments = await this.commentsRepository.find({
        where: {
          createdat: Between(today, tomorrow),
        },
      });

      if (todayComments.length === 0)
        throw new Error("今日はまだコメントがありません！");

      return { result: true, todayComments, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, todayComments: [], message: error.message };
      }
      console.error(error);
      return { result: false, todayComments: [], message: "不具合が発生" };
    }
  }

  async getMonthlyComments(date: string): Promise<{
    result: boolean;
    monthlyComments: Comments[];
    message: string | null;
  }> {
    try {
      if (!isValidDate(date)) throw new Error("正しい日付を入力してください！");

      const startDate = dayjs(date).startOf("month").toDate();
      const endDate = dayjs(date).endOf("month").toDate();

      const monthlyComments = await this.commentsRepository.find({
        where: {
          createdat: Between(startDate, endDate),
        },
      });
      if (monthlyComments.length === 0)
        throw new Error("今月はコメントがまだありません！");

      return { result: true, monthlyComments, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, monthlyComments: [], message: error.message };
      }
      console.error(error);
      return { result: false, monthlyComments: [], message: "不具合が発生" };
    }
  }

  async createComment(
    message: string,
    userid: string
  ): Promise<{
    result: boolean;
    createdComment: Comments | null;
    message: string | null;
  }> {
    try {
      const comment = new Comments();
      comment.commentid = uuidv4();
      comment.message = message;
      comment.userid = userid;

      const createdComment = await this.commentsRepository.save(comment);
      if (!createdComment) {
        throw new Error("コメントを登録できませんでした");
      }

      return {
        result: true,
        createdComment,
        message: "コメントを登録しました！",
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return {
          result: false,
          createdComment: null,
          message: error.message,
        };
      }
      console.error(error);
      return { result: false, createdComment: null, message: "不具合が発生" };
    }
  }
}
