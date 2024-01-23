import { Request, Response } from "express";
import { CleaningService } from "../services/Cleaning.service";

export class CleaningController {
  constructor(private readonly claningService: CleaningService) {}

  async getTodayCleaningHandler(req: Request, res: Response) {
    const todayCleaning = await this.claningService.getTodayCleaning();
    if (!todayCleaning.result) {
      return res.status(400).json({ message: todayCleaning.message });
    }
    return res.status(200).json({ todayCleaning: todayCleaning.todayCleaning });
  }

  async getMonthlyCleaningHandler(req: Request, res: Response) {
    const { date } = req.params;
    const Cleaning = await this.claningService.getMonthlyMeals(date);
    if (!Cleaning.result) {
      return res.status(400).json({ message: Cleaning.message });
    }
    return res.status(200).json({ monthlyCleaning: Cleaning.monthlyCleaning });
  }

  async createCleaningHandler(req: Request, res: Response) {
    const { status } = req.body;

    const userid = req.auth?.userid;
    if (!userid) {
      return res.status(403).json({ message: "認証されていません！" });
    }

    const createdCleaning = await this.claningService.createCleaning(
      status,
      userid
    );
    if (!createdCleaning.result) {
      return res.status(400).json({ message: createdCleaning.message });
    }
    return res.status(200).json({
      createdCleaning: createdCleaning.createdCleaning,
      message: createdCleaning.message,
    });
  }
}
