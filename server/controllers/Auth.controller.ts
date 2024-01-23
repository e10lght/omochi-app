import { Request, Response } from "express";
import { AuthService } from "../services/Auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async loginHandler(req: Request, res: Response) {
    const { email, userid, password } = req.body;

    const { result, user, token, message } = await this.authService.login(
      email,
      userid,
      password
    );

    if (!result) {
      return res.status(401).json({ message: message });
    }

    const oneDayInMilliseconds = 168 * 60 * 60 * 1000;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: oneDayInMilliseconds,
    });

    return res.status(200).json({
      message: "ログインに成功しました",
      user,
      token,
    });
  }

  logoutHandler = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "ログアウトに成功しました" });
  };
}
