import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CreatedComment } from "../../../stores/useCommentsStore";

type PCommentCreationModal = {
  isOpen: boolean;
  onClose: () => void;
  createComment: (message: string) => Promise<{
    createdComment: CreatedComment | null;
    status: number;
    error: string | null;
  }>;
};

const schema = z.object({
  comments: z.string().min(1, "必須項目です"),
});

export const CommentCreationModal: React.FC<PCommentCreationModal> = (
  props
) => {
  const { isOpen, onClose, createComment } = props;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ comments: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<{ comments: string }> = (data) => {
    createComment(data.comments)
      .then((res) => console.info(res))
      .catch((err) => console.error(err.message));
    reset();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="80%">
          <ModalHeader>コメント投稿</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Textarea
                id="comments"
                placeholder="ここにコメントを書いてください"
                {...register("comments")}
              />
              {typeof errors.comments?.message === "string" ? (
                <p>{errors.comments.message}</p>
              ) : null}
              <Button
                type="submit"
                colorScheme="blue"
                disabled={isSubmitting}
                my={3}
                w="100%"
              >
                コメントを登録する
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
