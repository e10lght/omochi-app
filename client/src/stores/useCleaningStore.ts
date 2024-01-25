import { create } from "zustand";
import { Cleaning } from "../types/cleaning";

type TodayCleaning = {
  todayCleaning: Cleaning;
  message: string;
};

type MonthlyCleaning = {
  monthlyCleaning: Cleaning[];
};

type CreatedCleaning = {
  createdCleaning: Cleaning;
  message: string;
};

type CreateCleaningStore = {
  createdCleaning: Cleaning | null;
  todayCleaning: Cleaning | null;
  monthlyCleaning: Cleaning[];
  createCleaning: () => Promise<{
    createdCleaning: CreatedCleaning | null;
    status: number;
    error: string | null;
  }>;
  getTodayCleaning: () => Promise<{
    todayCleaning: Cleaning | null;
    status: number;
    error: string | null;
  }>;
  getMonthlyCleaning: (date: string) => Promise<{
    monthlyCleaning: Cleaning[];
    status: number;
    error: string | null;
  }>;
};

export const useCleaningStore = create<CreateCleaningStore>((set) => ({
  createdCleaning: null,
  todayCleaning: null,
  monthlyCleaning: [],
  createCleaning: async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/cleaning/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeOfDay: "",
          status: "done",
        }),
      });

      const data: CreatedCleaning = await res.json();

      if (!res.ok) {
        return {
          createdCleaning: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ createdCleaning: data.createdCleaning });
      return {
        createdCleaning: data,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { createdCleaning: null, status: 500, error: error.message };
      } else {
        return {
          createdCleaning: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getTodayCleaning: async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/cleaning/today`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: TodayCleaning = await res.json();

      if (!res.ok) {
        return {
          todayCleaning: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ todayCleaning: data.todayCleaning });
      return {
        todayCleaning: data.todayCleaning,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { todayCleaning: null, status: 500, error: error.message };
      } else {
        return {
          todayCleaning: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getMonthlyCleaning: async (date: string) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/cleaning/monthly/${date}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: MonthlyCleaning = await res.json();

      if (!res.ok) {
        return {
          monthlyCleaning: [],
          status: res.status,
          error: null,
        };
      }

      set({ monthlyCleaning: data.monthlyCleaning });
      return {
        monthlyCleaning: data.monthlyCleaning,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { monthlyCleaning: [], status: 500, error: error.message };
      } else {
        return {
          monthlyCleaning: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
}));
