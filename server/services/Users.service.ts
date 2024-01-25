import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { Users } from "../models/Users.model";

export class UsersService {
  constructor(private readonly usersRepository: Repository<Users>) {}

  async getUser(userid: string | undefined) {
    try {
      if (!userid) throw new Error("ユーザIDは必須です");
      const user = await this.usersRepository.findOne({
        where: { userid },
      });
      if (!user) throw new Error("ユーザが見つかりません");

      return { result: true, user: user, message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, user: null, message: error.message };
      }
      return { result: false, user: null, message: "不具合が発生しました" };
    }
  }

  async updateUser(user: Partial<Users> & Required<Pick<Users, "userid">>) {
    try {
      if (!user.userid) {
        throw new Error("ユーザIDは必須です");
      }
      const targetUser = await this.getUser(user.userid);
      if (!targetUser.result) {
        throw new Error("存在しないユーザ情報は更新できません");
      }
      const target: Partial<Omit<Users, "userid">> = Object.entries(user)
        .filter((field) => field[1] || field[1] !== "userid")
        .reduce<Record<string, string | number | Date>>((acc, m) => {
          acc[m[0]] = m[1];
          return acc;
        }, {});

      if (Object.entries(target).length === 0) {
        throw new Error("更新対象の値がありません");
      }

      const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (target.email && !regex.test(target.email)) {
        throw new Error("メールアドレスが不正です");
      }
      if (target.password && target.password.length < 8) {
        throw new Error("パスワードは8文字以上である必要があります");
      } else if (target.password) {
        target.password = await bcrypt.hash(target.password, 10);
      }

      const updatedUser = await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set(target)
        .where("userid = :userid", { userid: user.userid })
        .returning([
          "userid",
          "email",
          "name",
          "id",
          "password",
          "createdat",
          "updatedat",
        ])
        .execute();

      return { result: true, updatedUser: updatedUser.raw[0], message: null };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { result: false, updatedUser: null, message: error.message };
      }
      console.error(error);
      return {
        result: false,
        updatedUser: null,
        message: "不具合が発生しました",
      };
    }
  }
}
