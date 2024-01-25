import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import { Repository } from "typeorm";
import { Users } from "../models/Users.model";

export class AuthService {
  constructor(private readonly usersRepository: Repository<Users>) {}

  async login(
    email: string,
    userid: string,
    password: string
  ): Promise<{
    result: boolean;
    user: { email: string; name: string; userid: string } | null;
    token: string | null;
    message: string | null;
  }> {
    try {
      if (!email && !userid) {
        throw new Error("メールアドレスまたはユーザIDを入力してください");
      }
      if (!password) {
        throw new Error("パスワードを入力してください");
      }

      const user = await this.usersRepository.findOne({
        where: [{ email }, { userid }],
      });

      if (!user) throw new Error("ユーザーが見つかりません");

      const isChecked = await bcrypt.compare(password, user.password);

      if (!isChecked)
        throw new Error(
          "入力したメールアドレスまたはパスワードが間違っています"
        );

      const token = jwt.sign({ userid: user.userid }, SECRET_KEY, {
        expiresIn: "7d",
      });
      return {
        result: true,
        user: { email: user.email, name: user.name, userid: user.userid },
        token,
        message: null,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          result: false,
          user: null,
          token: null,
          message: error.message,
        };
      }
      return {
        result: false,
        user: null,
        token: null,
        message: "不具合が発生しました",
      };
    }
  }
}
