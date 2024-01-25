import { create } from "zustand";
import { Meal } from "../types/meal";

type TodayMeal = {
  todayMeal: Meal[];
  message: string;
};

type MonthlyMeal = {
  monthlyMeals: Meal[];
  message: string;
};

type CreatedMeal = {
  createdMeal: Meal;
  message: string;
};

type CreateMealStore = {
  createdMeal: Meal | null;
  todayMeals: Meal[];
  monthlyMeals: Meal[];
  createMeal: (timeOfDay: string) => Promise<{
    createdMeal: CreatedMeal | null;
    status: number;
    error: string | null;
  }>;
  getTodayMeals: () => Promise<{
    todayMeals: Meal[];
    status: number;
    error: string | null;
  }>;
  getMonthlyMeals: (date: string) => Promise<{
    monthlyMeals: Meal[];
    status: number;
    error: string | null;
  }>;
};

export const useMealStore = create<CreateMealStore>((set) => ({
  createdMeal: null,
  todayMeals: [],
  monthlyMeals: [],
  createMeal: async (timeOfDay: string) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/meal/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeOfDay: timeOfDay,
          status: "done",
        }),
      });

      const data: CreatedMeal = await res.json();

      if (!res.ok) {
        return {
          createdMeal: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ createdMeal: data.createdMeal });
      return {
        createdMeal: data,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { createdMeal: null, status: 500, error: error.message };
      } else {
        return {
          createdMeal: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getTodayMeals: async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/meal/today`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: TodayMeal = await res.json();

      if (!res.ok) {
        return {
          todayMeals: [],
          status: res.status,
          error: data.message,
        };
      }

      set({ todayMeals: data.todayMeal });
      return {
        todayMeals: data.todayMeal,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { todayMeals: [], status: 500, error: error.message };
      } else {
        return {
          todayMeals: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getMonthlyMeals: async (date: string) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/meal/monthly/${date}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: MonthlyMeal = await res.json();

      if (!res.ok) {
        return {
          monthlyMeals: [],
          status: res.status,
          error: data.message,
        };
      }

      set({ monthlyMeals: data.monthlyMeals });
      return {
        monthlyMeals: data.monthlyMeals,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { monthlyMeals: [], status: 500, error: error.message };
      } else {
        return {
          monthlyMeals: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
}));
