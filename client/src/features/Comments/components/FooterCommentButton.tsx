import { ChatIcon } from "@chakra-ui/icons";
import { Flex, Button } from "@chakra-ui/react";

type PFooterCommentButton = {
  onClick: () => void;
};

export const FooterCommentButton: React.FC<PFooterCommentButton> = (props) => {
  const { onClick } = props;

  return (
    <Flex
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      justifyContent="center"
      bg="#3182ce"
    >
      <Button
        leftIcon={<ChatIcon />}
        colorScheme="blue"
        w="100%"
        onClick={onClick}
      >
        コメントを残す
      </Button>
    </Flex>
  );
};
