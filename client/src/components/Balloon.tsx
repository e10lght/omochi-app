import { Box, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Balloon: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      position="relative"
      margin="1rem 0 1em 40px"
      padding="15px"
      bg="#fff"
      borderRadius="30px"
      _before={{
        content: '""',
        position: "absolute",
        left: "-38px",
        width: "13px",
        height: "12px",
        bottom: "0",
        bg: "#fff",
        borderRadius: "50%",
      }}
      _after={{
        content: '""',
        position: "absolute",
        left: "-24px",
        width: "20px",
        height: "18px",
        bottom: "3px",
        bg: "#fff",
        borderRadius: "50%",
      }}
    >
      <Text margin="0" padding="0">
        {children}
      </Text>
    </Box>
  );
};
