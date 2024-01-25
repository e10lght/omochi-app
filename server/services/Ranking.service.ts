import { Repository } from "typeorm";
import { Cleaning } from "../models/Cleaning.model";
import { Meals } from "../models/Meals.model";
import { Users } from "../models/Users.model";

export class RankingService {
  constructor(
    private readonly mealsRepositroty: Repository<Meals>,
    private readonly cleaningRepository: Repository<Cleaning>,
    private readonly usersRepository: Repository<Users>
  ) {}

  async getMonthlyTermRank(): Promise<
    {
      userid: string;
      username: string;
      totalCount: number;
    }[]
  > {
    try {
      const userMealCounts = await this.mealsRepositroty
        .createQueryBuilder("m")
        .select("m.userid", "userid")
        .addSelect("COUNT(m.mealid)", "mealCount")
        .groupBy("m.userid")
        .getRawMany();

      const userCleaningCounts = await this.cleaningRepository
        .createQueryBuilder("m")
        .select("m.userid", "userid")
        .addSelect("COUNT(m.cleaningid)", "cleaningCount")
        .groupBy("m.userid")
        .getRawMany();

      const allUserList = await this.usersRepository.find();

      const countByUser = allUserList.map((user) => {
        let mealCount = 0;
        let cleaningCount = 0;

        const filterMealCount = userMealCounts.find(
          (meal) => meal.userid === user.userid
        );
        if (filterMealCount) {
          mealCount = Number(filterMealCount.mealCount);
        }

        const filterCleaningCount = userCleaningCounts.find(
          (cleaning) => cleaning.userid === user.userid
        );
        if (filterCleaningCount) {
          cleaningCount = Number(filterCleaningCount.cleaningCount);
        }

        const count = mealCount + cleaningCount;
        return { userid: user.userid, username: user.name, totalCount: count };
      });

      const sortedCount = countByUser.sort(function (a, b) {
        return a.totalCount < b.totalCount ? 1 : -1;
      });

      const ranking = sortedCount.map((r, i) => {
        return { ...r, rank: ++i };
      });

      return ranking;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return [];
      } else {
        console.error(error);
        return [];
      }
    }
  }
}
