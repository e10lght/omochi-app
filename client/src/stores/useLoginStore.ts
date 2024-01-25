import { create } from "zustand";
import { InputsType, LoginResult } from "../features/Login/types/login";
import { User } from "../types/users";

type LoginStore = {
  user: User | null;
  postLogin: (input: InputsType) => Promise<{
    user: User | null;
    message: string;
    status: number;
  }>;
};

export const useLoginStore = create<LoginStore>((set) => ({
  user: null,
  postLogin: async (input: InputsType) => {
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: input.emailOrUserid,
          userid: input.emailOrUserid,
          password: input.password,
        }),
      });
      const data: LoginResult = await res.json();

      if (!res.ok) {
        return {
          user: null,
          message: data.message,
          status: res.status,
          error: data?.message || "エラーが発生しました",
        };
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }

      set({ user: data.user });
      return { user: data.user, message: data.message, status: res.status };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return {
          user: null,
          message: error.message,
          status: 500,
        };
      } else {
        return {
          user: null,
          message: "不具合が発生しました",
          status: 500,
        };
      }
    }
  },
}));
