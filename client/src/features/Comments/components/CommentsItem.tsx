import { Box, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Comment } from "../types/comments";

type PComments = {
  comments: Comment[];
};
export const CommentsItem: React.FC<PComments> = (props) => {
  const { comments } = props;

  if (comments.length === 0) return null;
  return (
    <>
      <Stack spacing={1}>
        {comments.map((c) => (
          <Box
            bg="white"
            w="100%"
            p={4}
            color="gray.800"
            key={c.commentid}
            borderRadius="10px"
          >
            <Text mb={1}>投稿者{c.userid}</Text>
            <Text>{c.message}</Text>
            <Text fontSize="sm">
              作成日：
              {dayjs(c.createdat).add(9, "hours").format("YYYY年M月D日")}
            </Text>
          </Box>
        ))}
      </Stack>
    </>
  );
};
