import { Flex, Avatar } from "@chakra-ui/react";
import { Balloon } from "../../components/Balloon";
import { Header } from "../../components/Header";
import { Comments } from "../../features/Comments/components/Comments";

export const CommetsHandler = () => {
  return (
    <>
      <div style={{ marginTop: "56px" }}>
        <Header />
        <Flex alignItems="center" justifyContent="center" mx={5}>
          <Avatar w="70px" h="70px" name="おもち" src="omochi-avatar.png" />
          <Balloon>
            コメントを残したり、他の人が残したコメントを見れるよ🐇❤
          </Balloon>
        </Flex>
        <Comments />
      </div>
    </>
  );
};
