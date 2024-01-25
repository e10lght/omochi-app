import { Heading, Flex, Spacer, Box, Text, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { CalendarIcon, ChatIcon, SettingsIcon } from "@chakra-ui/icons";

export const Header = memo(() => {
  const navigate = useNavigate();

  return (
    <Flex
      align="center"
      justify="space-between"
      h="14"
      bg="yellow.800"
      color="gray.100"
      alignItems="center"
      gap="2"
      borderBottom="1px solid #333"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="10"
    >
      <Box p="5">
        <Heading size="md" as="h2">
          <Text onClick={() => navigate("/home")}>おもちのおせわ</Text>
        </Heading>
      </Box>
      <Spacer />
      <Flex gap={4} alignItems="center">
        <IconButton
          colorScheme="yellow.800"
          aria-label="Call Segun"
          size="lg"
          icon={<CalendarIcon />}
          onClick={() => navigate("/calendar")}
        />
        <IconButton
          colorScheme="yellow.800"
          aria-label="Call Segun"
          size="lg"
          icon={<ChatIcon />}
          onClick={() => navigate("/comments")}
        />
        {/* <IconButton
          colorScheme="yellow.800"
          aria-label="Call Segun"
          size="lg"
          icon={<AttachmentIcon />}
          onClick={() => navigate("/links")}
        /> */}
        <IconButton
          colorScheme="yellow.800"
          aria-label="Call Segun"
          size="lg"
          icon={<SettingsIcon />}
          onClick={() => navigate("/setting")}
        />
      </Flex>
    </Flex>
  );
});
