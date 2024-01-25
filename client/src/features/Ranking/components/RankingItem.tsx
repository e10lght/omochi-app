import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const RankingItem: React.FC<any> = ({ rank, name, score }) => {
  const [prize, setPrize] = useState<{
    icon: string;
    bg: string;
    size: string;
  }>({
    icon: "",
    bg: "",
    size: "12px",
  });

  useEffect(() => {
    if (rank === 1) {
      setPrize({ icon: "🥇", bg: "gold", size: "24px" });
    } else if (rank === 2) {
      setPrize({ icon: "🥈", bg: "silver", size: "20px" });
    } else if (rank === 3) {
      setPrize({ icon: "🥉", bg: "chocolate", size: "16px" });
    }
  }, []);

  return (
    <Box bg={prize.bg}>
      <Text fontWeight="bold" fontSize={prize.size}>
        {prize.icon}#{rank}:{name}
      </Text>
      <Text>{`お世話した回数: ${score}`}</Text>
    </Box>
  );
};
