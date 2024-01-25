import {
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Popover,
} from "@chakra-ui/react";
import { memo } from "react";

type PopoverProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setCurrentPopover: (value: React.SetStateAction<string>) => void;
  onClick: () => Promise<void>;
};

export const Pop: React.FC<PopoverProps> = memo((props) => {
  const { children, isOpen, setCurrentPopover, onClick } = props;
  return (
    <Popover isOpen={isOpen} onClose={() => setCurrentPopover("")}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>やり残したことはないですか？🐰</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Button onClick={onClick} colorScheme="blue">
              全部完了しました！✨
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
