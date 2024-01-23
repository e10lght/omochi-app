import { Request, Response } from "express";
import { MealsService } from "../services/Meals.service";

export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  async getTodayMealHandler(req: Request, res: Response) {
    const todayMeal = await this.mealsService.getTodayMeal();
    if (!todayMeal.result) {
      return res.status(400).json({ message: todayMeal.message });
    }
    return res.status(200).json({ todayMeal: todayMeal.data });
  }

  async getMonthlyMealHandler(req: Request, res: Response) {
    const { date } = req.params;
    const meals = await this.mealsService.getMonthlyMeals(date);
    if (!meals.result) {
      return res.status(400).json({ message: meals.message });
    }
    return res.status(200).json({ monthlyMeals: meals.data });
  }

  async createMealHandler(req: Request, res: Response) {
    const { timeOfDay, status } = req.body;

    const userid = req.auth?.userid;
    if (!userid) {
      return res.status(403).json({ message: "認証されていません！" });
    }

    const createdMeal = await this.mealsService.createMeal(
      timeOfDay,
      status,
      userid
    );
    if (!createdMeal.result) {
      return res.status(400).json({ message: createdMeal.message });
    }
    return res.status(200).json({
      createdMeal: createdMeal.createdMeal,
      message: createdMeal.message,
    });
  }
}
