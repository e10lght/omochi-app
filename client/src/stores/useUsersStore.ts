import { create } from "zustand";
import { User } from "../types/users";

type CreateUserStore = {
  user: User | null;
  getUser: (userid: string | undefined) => Promise<{
    user: User | null;
    status: number;
    error: string | null;
  }>;
  getLoggedInUser: () => Promise<{
    user: User | null;
    status: number;
    error: string | null;
  }>;
  updateUser: (user: Partial<User>) => Promise<{
    user: User | null;
    status: number;
    error: string | null;
  }>;
};

export const useUsersStore = create<CreateUserStore>((set) => ({
  user: null,
  getUser: async (userid: string | undefined) => {
    try {
      const res = await fetch(`/api/user/${userid}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { user: User | null; message: string | null } =
        await res.json();

      if (!res.ok) {
        return {
          user: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ user: data.user });
      return {
        user: data.user,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { user: null, status: 500, error: error.message };
      } else {
        return {
          user: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  getLoggedInUser: async () => {
    try {
      const res = await fetch(`/api/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { user: User | null; message: string | null } =
        await res.json();

      if (!res.ok) {
        return {
          user: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ user: data.user });
      return {
        user: data.user,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { user: null, status: 500, error: error.message };
      } else {
        return {
          user: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
  updateUser: async (user: Partial<User>) => {
    try {
      const res = await fetch(`/api/user/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
        }),
      });

      const data: {
        updatedUser: User | null;
        message: string | null;
      } = await res.json();

      if (!res.ok) {
        return {
          user: null,
          status: res.status,
          error: data.message,
        };
      }

      set({ user: data.updatedUser });
      return {
        user: data.updatedUser,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { user: null, status: 500, error: error.message };
      } else {
        return {
          user: null,
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
}));
