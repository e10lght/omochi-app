import { Box, Heading, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Ranking, useRankingStore } from "../../../stores/useRankingStore";
import { RankingItem } from "./RankingItem";

export const CareRanking: React.FC<any> = () => {
  const { getRankingAllTerm, rankingAllTerm } = useRankingStore();
  useEffect(() => {
    getRankingAllTerm()
      .then((res) => console.info(res))
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <>
      <Box mx={5}>
        <Heading as="h3" mb={2} size="lg">
          お世話数ランキング
        </Heading>
        <Stack spacing={2}>
          {rankingAllTerm.map((item: Ranking) => (
            <RankingItem
              key={item.userid}
              rank={item.rank}
              name={item.username}
              score={item.totalCount}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
};
