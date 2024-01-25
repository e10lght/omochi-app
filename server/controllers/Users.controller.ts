import { Request, Response } from "express";
import { UsersService } from "../services/Users.service";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getUserHandler(req: Request, res: Response) {
    const { userid = req.auth?.userid } = req.params;
    const user = await this.usersService.getUser(userid);
    if (!user.result) {
      return res.status(400).json({ user: user.user, message: user.message });
    }
    return res.status(200).json({ user: user.user, message: user.message });
  }

  async updateUserHandler(req: Request, res: Response) {
    const { user } = req.body;
    if (!user.userid) {
      user.userid = req.auth?.userid;
    }
    const updatedUser = await this.usersService.updateUser(user);
    if (!updatedUser.result) {
      return res
        .status(400)
        .json({ user: updatedUser.updatedUser, message: updatedUser.message });
    }
    return res.status(200).json({
      updatedUser: updatedUser.updatedUser,
      message: updatedUser.message,
    });
  }
}
