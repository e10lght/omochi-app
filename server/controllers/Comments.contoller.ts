import { Request, Response } from "express";
import { CommentsService } from "../services/Comments.service";

export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  async getTodayCommentsHandler(req: Request, res: Response) {
    const todayComments = await this.commentsService.getTodayComments();
    if (!todayComments.result) {
      return res.status(400).json({ message: todayComments.message });
    }
    return res.status(200).json({ todayComments: todayComments.todayComments });
  }

  async getMonthlyCommentsHandler(req: Request, res: Response) {
    const { date } = req.params;
    const Comments = await this.commentsService.getMonthlyComments(date);
    if (!Comments.result) {
      return res.status(400).json({ message: Comments.message });
    }
    return res.status(200).json({ monthlyComments: Comments.monthlyComments });
  }

  async createCommentHandler(req: Request, res: Response) {
    const { message } = req.body;

    const userid = req.auth?.userid;
    if (!userid) {
      return res.status(403).json({ message: "認証されていません！" });
    }

    const createdComment = await this.commentsService.createComment(
      message,
      userid
    );
    if (!createdComment.result) {
      return res.status(400).json({ message: createdComment.message });
    }
    return res.status(200).json({
      createdComment: createdComment.createdComment,
      message: createdComment.message,
    });
  }
}
