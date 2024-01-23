import express, { Request, Response } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { CleaningController } from "../controllers/Cleaning.controller";
import { CommentsController } from "../controllers/Comments.contoller";
import { LineApiController } from "../controllers/LineApi.controller";
import { MealsController } from "../controllers/Meals.controller";
import { AppDataSource } from "../db/connect";
import { Cleaning } from "../models/Cleaning.model";
import { Comments } from "../models/Comments.model";
import { Meals } from "../models/Meals.model";
import { Users } from "../models/Users.model";
import { AuthService } from "../services/Auth.service";
import { CleaningService } from "../services/Cleaning.service";
import { CommentsService } from "../services/Comments.service";
import { LineApiService } from "../services/LineApi.service";
import { MealsService } from "../services/Meals.service";

const usersRepository = AppDataSource.getRepository(Users);
const mealsRepository = AppDataSource.getRepository(Meals);
const cleaningRepository = AppDataSource.getRepository(Cleaning);
const commentsRepository = AppDataSource.getRepository(Comments);

const router = express.Router();

const lineApiServie = new LineApiService(usersRepository);
const mealsService = new MealsService(mealsRepository);
const authService = new AuthService(usersRepository);
const cleaningService = new CleaningService(cleaningRepository);
const commentsService = new CommentsService(commentsRepository);

const lineApiController = new LineApiController(lineApiServie);
const mealsController = new MealsController(mealsService);
const authController = new AuthController(authService);
const cleaningController = new CleaningController(cleaningService);
const commentsController = new CommentsController(commentsService);

router.post("/line/message", (req: Request, res: Response) =>
  lineApiController.broadcastingMessageHandler(req, res)
);

router.get("/meal/today", (req: Request, res: Response) =>
  mealsController.getTodayMealHandler(req, res)
);

router.get("/meal/monthly/:date", (req: Request, res: Response) =>
  mealsController.getMonthlyMealHandler(req, res)
);

router.post("/meal/create", (req: Request, res: Response) =>
  mealsController.createMealHandler(req, res)
);

router.post("/auth/login", (req: Request, res: Response) =>
  authController.loginHandler(req, res)
);

router.post("/auth/logout", (req: Request, res: Response) =>
  authController.logoutHandler(req, res)
);

router.get("/cleaning/today", (req: Request, res: Response) =>
  cleaningController.getTodayCleaningHandler(req, res)
);

router.get("/cleaning/monthly/:date", (req: Request, res: Response) =>
  cleaningController.getMonthlyCleaningHandler(req, res)
);

router.post("/cleaning/create", (req: Request, res: Response) =>
  cleaningController.createCleaningHandler(req, res)
);

router.get("/comment/today", (req: Request, res: Response) =>
  commentsController.getTodayCommentsHandler(req, res)
);

router.get("/comment/monthly/:date", (req: Request, res: Response) =>
  commentsController.getMonthlyCommentsHandler(req, res)
);

router.post("/comment/create", (req: Request, res: Response) =>
  commentsController.createCommentHandler(req, res)
);

export default router;
