import { Box, Heading, Stack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ranking, useRankingStore } from "../../../stores/useRankingStore";
import { RankingItem } from "./RankingItem";

export const CareRanking: React.FC<any> = () => {
  const { getRankingAllTerm, rankingAllTerm } = useRankingStore();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getRankingAllTerm()
      .then((res) => {
        if (res.status === 401) {
          toast({
            title: "セッションが切れました、\n再度ログインしてください",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navigate("/");
        }
      })
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
