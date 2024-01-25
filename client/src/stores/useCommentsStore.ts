import { create } from "zustand";
import { Comment } from "../features/Comments/types/comments";

type TodayComment = {
  todayComments: Comment[];
  message: string;
};

type MonthlyComments = {
  monthlyComments: Comment[];
};

export type CreatedComment = {
  createdComment: Comment;
  message: string;
};

type CreateCommentStore = {
  createdComment: Comment | null;
  todayComment: Comment[];
  monthlyComments: Comment[];
  getTodayComment: () => Promise<{
    todayComment: Comment[];
    status: number;
    error: string | null;
  }>;
  getMonthlyComments: (date: string) => Promise<{
    monthlyComments: Comment[];
    status: number;
    error: string | null;
  }>;
  createComment: (message: string) => Promise<{
    createdComment: CreatedComment | null;
    status: number;
    error: string | null;
  }>;
};

export const useCommentsStore = create<CreateCommentStore>((set) => ({
  createdComment: null,
  todayComment: [],
  monthlyComments: [],
  createComment: async (message: string) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data: CreatedComment = await res.json();

      if (!res.ok) {
        return {
          createdComment: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ createdComment: data.createdComment });
      return {
        createdComment: data,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { createdComment: null, status: 500, error: error.message };
      } else {
        return {
          createdComment: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getTodayComment: async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/comment/today`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: TodayComment = await res.json();

      if (!res.ok) {
        return {
          todayComment: [],
          status: res.status,
          error: data.message,
        };
      }

      set({ todayComment: data.todayComments });
      return {
        todayComment: data.todayComments,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { todayComment: [], status: 500, error: error.message };
      } else {
        return {
          todayComment: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getMonthlyComments: async (date: string) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/comment/monthly/${date}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: MonthlyComments = await res.json();

      if (!res.ok) {
        return {
          monthlyComments: [],
          status: res.status,
          error: null,
        };
      }

      set({ monthlyComments: data.monthlyComments });
      return {
        monthlyComments: data.monthlyComments,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { monthlyComments: [], status: 500, error: error.message };
      } else {
        return {
          monthlyComments: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
}));
