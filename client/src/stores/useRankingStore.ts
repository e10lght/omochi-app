import { create } from "zustand";

export type Ranking = {
  userid: string;
  username: string;
  totalCount: number;
  rank: number;
};
type RankingStore = {
  rankingAllTerm: Ranking[];
  getRankingAllTerm: () => Promise<{
    rankingAllTerm: Ranking[];
    status: number;
    error: string | null;
  }>;
};

export const useRankingStore = create<RankingStore>((set) => ({
  rankingAllTerm: [],
  getRankingAllTerm: async () => {
    try {
      const res = await fetch(`/api/ranking/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { ranking: Ranking[] } = await res.json();

      if (!res.ok) {
        return {
          rankingAllTerm: [],
          status: res.status,
          error: "ランキングを取得できませんでした",
        };
      }

      set({ rankingAllTerm: data.ranking });
      return {
        rankingAllTerm: data.ranking,
        status: res.status,
        error: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return {
          rankingAllTerm: [],
          status: 500,
          error: "ランキングを取得できませんでした",
        };
      } else {
        return {
          rankingAllTerm: [],
          status: 500,
          error: "不明なエラーが発生しました",
        };
      }
    }
  },
}));
