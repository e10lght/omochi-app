import { Badge, useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CarendarModal } from "./CarendarModal";
import "../../styles/react-calendar.css";
import { useMealStore } from "../../stores/useMealStore";
import { useCleaningStore } from "../../stores/useCleaningStore";
import { Cleaning } from "../../types/cleaning";
import { Meal } from "../../types/meal";
import { LoadingModal } from "../../components/LoadingModal";

export const Calendar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detail, setDetail] = useState<{
    morningMeal: Meal | undefined;
    dinnerMeal: Meal | undefined;
    cleaning: Cleaning | undefined;
  }>();
  const [targetDate, setTargetDate] = useState<Date>();
  const [monthlyMeals, setMonthlyMeals] = useState<Meal[]>([]);
  const [monthlyCleaning, setMonthlyCleaning] = useState<Cleaning[]>([]);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { getMonthlyMeals } = useMealStore();
  const { getMonthlyCleaning } = useCleaningStore();

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      getMonthlyMeals(dayjs(activeStartDate).format()),
      getMonthlyCleaning(dayjs(activeStartDate).format()),
    ])
      .then(([mealsResponse, cleaningResponse]) => {
        setMonthlyMeals(mealsResponse.monthlyMeals);
        setMonthlyCleaning(cleaningResponse.monthlyCleaning);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("データの取得に失敗しました:", error);
        setIsLoading(false);
      });
  }, [activeStartDate]);

  const tileContent = ({ date, view }: any): JSX.Element | null => {
    if (view === "month") {
      const targetDate = dayjs(date);
      const matchingMeal = monthlyMeals.filter((meal) =>
        dayjs(meal.createdat)
          .add(9, "hours")
          .startOf("day")
          .isSame(dayjs(targetDate).startOf("day"), "day")
      );
      const matchingCleaning = monthlyCleaning.filter((c) => {
        return dayjs(c.createdat)
          .add(9, "hours")
          .startOf("day")
          .isSame(dayjs(targetDate).startOf("day"), "day");
      });

      return matchingMeal.length !== 0 || matchingCleaning.length !== 0 ? (
        <>
          {matchingMeal.map((meal) => (
            <Badge
              colorScheme="green"
              style={{ fontSize: "10px" }}
              key={meal.mealid}
            >
              {meal.timeofday}
              {meal.status}
            </Badge>
          ))}
          {matchingCleaning.map((c) => (
            <Badge
              colorScheme="blue"
              style={{ fontSize: "10px" }}
              key={c.cleaningid}
            >
              {c.status}
            </Badge>
          ))}
        </>
      ) : null;
    }
    return null;
  };

  const onClickHandler = (e: any) => {
    const targetMealMorinig = monthlyMeals.find(
      (meal) =>
        dayjs(meal.createdat).add(18, "hours").isSame(e, "day") &&
        meal.timeofday === "朝"
    );
    const targetMealDinner = monthlyMeals.find(
      (meal) =>
        dayjs(meal.createdat).add(18, "hours").isSame(e, "day") &&
        meal.timeofday === "夜"
    );

    const targetCleaning = monthlyCleaning.find((c) => {
      return dayjs(c.createdat)
        .add(18, "hours")
        .startOf("day")
        .isSame(dayjs(e).startOf("day"), "day");
    });

    const details = {
      morningMeal: targetMealMorinig,
      dinnerMeal: targetMealDinner,
      cleaning: targetCleaning,
    };
    setDetail(details);
    setTargetDate(e);
    onOpen();
  };

  const handleMonthChange = ({ activeStartDate }: any) => {
    setActiveStartDate(activeStartDate);
  };

  return (
    <>
      <LoadingModal isLoading={isLoading} onClose={onClose} />

      <ReactCalendar
        onClickDay={onClickHandler}
        tileContent={tileContent}
        onActiveStartDateChange={handleMonthChange}
      />
      <Badge colorScheme="green" style={{ fontSize: "10px" }}>
        食事
      </Badge>
      <Badge colorScheme="blue" style={{ fontSize: "10px" }}>
        掃除
      </Badge>
      <CarendarModal
        isOpen={isOpen}
        onClose={onClose}
        target={detail!}
        targetDate={targetDate!}
      />
    </>
  );
};
