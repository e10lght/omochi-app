import { Flex, Modal, ModalOverlay, Spinner } from "@chakra-ui/react";

export const LoadingModal: React.FC<any> = (props) => {
  const { isLoading, onClose } = props;
  return (
    <Modal closeOnOverlayClick={false} isOpen={isLoading} onClose={onClose}>
      <ModalOverlay>
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Spinner size="xl" />
        </Flex>
      </ModalOverlay>
    </Modal>
  );
};
