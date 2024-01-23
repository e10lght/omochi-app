import { Request, Response } from "express";
import { LineApiService } from "../services/LineApi.service";

export class LineApiController {
  constructor(private readonly lineApiService: LineApiService) {}

  async broadcastingMessageHandler(req: Request, res: Response) {
    const { isMeal, timeOfDay } = req.body;
    const userid = req.auth?.userid;
    if (!userid) {
      return res.status(403).json({ message: "認証されていません！" });
    }
    const result = await this.lineApiService.broadcastingMessage(
      Boolean(isMeal),
      userid,
      timeOfDay
    );
    if (!result.result) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(200).json({ message: result.message });
  }
}
