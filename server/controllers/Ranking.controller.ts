import { Request, Response } from "express";
import { RankingService } from "../services/Ranking.service";

export class RankingControler {
  constructor(private readonly rankingService: RankingService) {}

  async getRankingHandler(req: Request, res: Response) {
    const result = await this.rankingService.getMonthlyTermRank();

    return res.status(200).json({ ranking: result });
  }
}
