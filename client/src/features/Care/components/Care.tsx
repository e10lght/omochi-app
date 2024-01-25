import { MoonIcon, StarIcon, SunIcon } from "@chakra-ui/icons";
import {
  Stack,
  Button,
  Heading,
  Text,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { LoadingModal } from "../../../components/LoadingModal";
import { Pop } from "../../../components/Pop";
import { useCleaningStore } from "../../../stores/useCleaningStore";
import { useLineApiStore } from "../../../stores/useLineApiStore";
import { useMealStore } from "../../../stores/useMealStore";
import { useUsersStore } from "../../../stores/useUsersStore";
import { Cleaning } from "../../../types/cleaning";
import { Meal } from "../../../types/meal";

export const Care = () => {
  const { onClose } = useDisclosure();

  const { getUser } = useUsersStore();
  const { getTodayMeals, createMeal, createdMeal } = useMealStore();
  const { getTodayCleaning, createCleaning, createdCleaning } =
    useCleaningStore();
  const { sendLineMessage } = useLineApiStore();

  const [morningMeal, setMorningMeal] = useState<Meal & { name: string }>();
  const [dinnerMeal, setDinnerMeal] = useState<Meal & { name: string }>();
  const [todayCleaning, setTodayCleaning] = useState<
    Cleaning & { name: string }
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPopover, setCurrentPopover] = useState("");

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getTodayMeals(), getTodayCleaning()]).then(
      async ([mealRes, cleaningRes]) => {
        const careTasks = [];

        const todayMeal = mealRes.todayMeals.find((m) => m.timeofday === "朝");
        if (todayMeal) {
          careTasks.push(
            getUser(todayMeal.userid).then((res) => {
              const username = res.user?.name || "";
              setMorningMeal({ ...todayMeal, name: username });
            })
          );
        }

        const dinnerMeal = mealRes.todayMeals.find((m) => m.timeofday === "夜");
        if (dinnerMeal) {
          careTasks.push(
            getUser(dinnerMeal.userid).then((res) => {
              const username = res.user?.name || "";
              setDinnerMeal({ ...dinnerMeal, name: username });
            })
          );
        }

        const todayCleaning = cleaningRes.todayCleaning;
        if (todayCleaning) {
          careTasks.push(
            getUser(todayCleaning.userid).then((res) => {
              const username = res.user?.name || "";
              setTodayCleaning({ ...todayCleaning, name: username });
            })
          );
        } else {
          setTodayCleaning(undefined);
        }
        await Promise.all(careTasks);

        setIsLoading(false);
      }
    );
  }, [createdCleaning, createdMeal]);

  const onClickMorningMeal = useCallback(async () => {
    setCurrentPopover("");
    setIsLoading(true);

    const isMeal = true;
    Promise.all([createMeal("朝"), sendLineMessage(isMeal, "朝")])
      .then(([_createdMealResponse, _lineApiResponse]) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setIsLoading(false);
      });
  }, []);

  const onClickDinnerMeal = useCallback(async () => {
    setCurrentPopover("");
    setIsLoading(true);

    const isMeal = true;
    Promise.all([createMeal("夜"), sendLineMessage(isMeal, "夜")])
      .then(([_createdMealResponse, _lineApiResponse]) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setIsLoading(false);
      });
  }, []);

  const onClickCleaning = useCallback(async () => {
    setCurrentPopover("");
    setIsLoading(true);

    const isMeal = false;
    Promise.all([createCleaning(), sendLineMessage(isMeal, undefined)])
      .then(([_createdCleaningResponse, _lineApiResponse]) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <LoadingModal isLoading={isLoading} onClose={onClose} />
      <Stack direction="column" spacing={4} mx={5}>
        <Box>
          <Heading as="h3" size="lg">
            おもちのお世話
          </Heading>
          <Text>今日の日付は「{dayjs().format("YYYY年M月D日")}」</Text>
        </Box>
        <Pop
          isOpen={currentPopover === "morningMeal"}
          setCurrentPopover={setCurrentPopover}
          onClick={onClickMorningMeal}
        >
          <Button
            leftIcon={<SunIcon />}
            colorScheme="green"
            variant="solid"
            onClick={() => setCurrentPopover("morningMeal")}
            isDisabled={morningMeal?.status === "done"}
          >
            {morningMeal?.status === "done"
              ? `${morningMeal?.name}さん!ありがとう🐰❤`
              : "朝の食事をあげた！"}
          </Button>
        </Pop>
        <Pop
          isOpen={currentPopover === "cleaning"}
          setCurrentPopover={setCurrentPopover}
          onClick={onClickCleaning}
        >
          <Button
            leftIcon={<StarIcon />}
            colorScheme="cyan"
            variant="solid"
            onClick={() => setCurrentPopover("cleaning")}
            isDisabled={todayCleaning?.status === "done"}
          >
            {todayCleaning?.status === "done"
              ? `${todayCleaning?.name}さん!ありがとう🐰❤`
              : "掃除をしてきれいにした！"}
          </Button>
        </Pop>
        <Pop
          isOpen={currentPopover === "dinnerMeal"}
          onClick={onClickDinnerMeal}
          setCurrentPopover={setCurrentPopover}
        >
          <Button
            leftIcon={<MoonIcon />}
            colorScheme="teal"
            variant="solid"
            onClick={() => setCurrentPopover("dinnerMeal")}
            isDisabled={dinnerMeal?.status === "done"}
          >
            {dinnerMeal?.status === "done"
              ? `${dinnerMeal?.name}さん!ありがとう🐰❤`
              : "夜の食事をあげた！"}
          </Button>
        </Pop>
      </Stack>
    </>
  );
};
