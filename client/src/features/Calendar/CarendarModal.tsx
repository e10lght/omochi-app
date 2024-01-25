import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Cleaning } from "../../types/cleaning";
import { Meal } from "../../types/meal";

type CarendarModalPlops = {
  isOpen: boolean;
  onClose: () => void;
  target: {
    morningMeal: Meal | undefined;
    dinnerMeal: Meal | undefined;
    cleaning: Cleaning | undefined;
  };
  targetDate: Date;
};

export const CarendarModal: React.FC<CarendarModalPlops> = (props) => {
  const { isOpen, onClose, target, targetDate } = props;
  if (!target || !targetDate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="80%">
        <ModalHeader>{dayjs(targetDate).format("YYYY年M月D日")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>食事（朝）お世話した人：{target.morningMeal?.userid}</Text>
          <Text>食事（夜）お世話した人：{target.dinnerMeal?.userid}</Text>
          <Text>掃除 お世話した人：{target.cleaning?.userid}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
