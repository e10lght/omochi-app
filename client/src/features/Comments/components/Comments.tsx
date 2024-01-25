import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCommentsStore } from "../../../stores/useCommentsStore";
import { CommentCreationModal } from "./CommentCreationModal";
import { CommentsItem } from "./CommentsItem";
import { FooterCommentButton } from "./FooterCommentButton";
import { Comment } from "../types/comments";
import dayjs from "dayjs";
import { LoadingModal } from "../../../components/LoadingModal";
import { useNavigate } from "react-router-dom";

export const Comments = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { getTodayComment, getMonthlyComments, createComment, createdComment } =
    useCommentsStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [todayComments, setTodayComments] = useState<Comment[]>([]);
  const [monthlyComments, setMonthlyComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getTodayComment(), getMonthlyComments(dayjs().format())])
      .then(([mealsResponse, cleaningResponse]) => {
        if (mealsResponse.status === 401) {
          toast({
            title: "セッションが切れました、\n再度ログインしてください",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navigate("/");
        }

        setTodayComments(mealsResponse.todayComment);
        setMonthlyComments(cleaningResponse.monthlyComments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("データの取得に失敗しました:", error);
        setIsLoading(false);
      });
  }, [createdComment]);

  const onClickHandler = () => {
    onOpen();
  };
  return (
    <>
      <LoadingModal isLoading={isLoading} onClose={onClose} />

      <Tabs isFitted borderColor="gray.100">
        <TabList>
          <Tab>今日</Tab>
          <Tab>今月</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CommentsItem comments={todayComments} />
          </TabPanel>
          <TabPanel>
            <CommentsItem comments={monthlyComments} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FooterCommentButton onClick={onClickHandler} />
      <CommentCreationModal
        isOpen={isOpen}
        onClose={onClose}
        createComment={createComment}
      />
    </>
  );
};
