import { create } from "zustand";

type LineApiStore = {
  sendLineMessage: (
    isMeal: boolean,
    timeOfDay: ("朝" | "夜") | undefined
  ) => Promise<{
    message: string;
    status: number;
  }>;
};

export const useLineApiStore = create<LineApiStore>((_set) => ({
  sendLineMessage: async (
    isMeal: boolean,
    timeOfDay: ("朝" | "夜") | undefined
  ) => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`/api/line/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isMeal,
          timeOfDay: timeOfDay,
        }),
      });
      const data: { message: string } = await res.json();

      if (!res.ok) {
        return {
          message: data.message,
          status: res.status,
          error: data.message,
        };
      }

      return { message: data.message, status: res.status };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return {
          message: error.message,
          status: 500,
        };
      } else {
        return {
          message: "不具合が発生しました",
          status: 500,
        };
      }
    }
  },
}));
