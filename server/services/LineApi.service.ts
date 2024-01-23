import { Repository } from "typeorm";
import { LINE_BOT_TOKEN } from "../config/config";
import { Users } from "../models/Users.model";

export class LineApiService {
  constructor(private readonly usersRepository: Repository<Users>) {}

  async broadcastingMessage(
    isMeal: boolean,
    userid: string,
    timeOfDay: "朝" | "夜"
  ) {
    const token = LINE_BOT_TOKEN;
    try {
      if (!(timeOfDay === "朝" || timeOfDay === "夜") && isMeal) {
        throw new Error("timeOfDayには「朝」または「夜」を指定してください");
      }

      const user = await this.usersRepository.findOne({ where: { userid } });
      if (!user) throw new Error("ユーザが見つかりません");

      let text = "";
      if (isMeal) {
        text = `${user.name}さんが${timeOfDay}ご飯をくれたよ！\nいつもありがとう！🐇❤️`;
      } else {
        text = `${user.name}さんが掃除してくれたよ！\nいつもありがとう！🐇❤️`;
      }

      const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              type: "text",
              text,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details.message);
      return { result: true, message: "いつもありがとう！" };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, message: error.message };
      }
      console.error(error);
      return { result: false, message: "不具合が発生しました" };
    }
  }
}
