import { Flex, Avatar } from "@chakra-ui/react";
import { Balloon } from "./Balloon";

type POmochiBaloon = {
  children: React.ReactNode;
};
export const OmochiBaloon: React.FC<POmochiBaloon> = (props) => {
  const { children } = props;
  return (
    <Flex alignItems="center" justifyContent="center" mx={5}>
      <Avatar w="70px" h="70px" name="おもち" src="omochi-avatar.png" />
      <Balloon>{children}</Balloon>
    </Flex>
  );
};
