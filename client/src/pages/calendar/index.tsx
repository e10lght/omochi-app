import { Avatar, Flex } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";
import { Balloon } from "../../components/Balloon";
import { Header } from "../../components/Header";
import { Calendar } from "../../features/Calendar/Calendar";

export const CalendarHandler = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: "56px" }}>
        <Calendar />
      </div>
      <Flex alignItems="center" justifyContent="center" mx={5}>
        <Avatar w="70px" h="70px" name="おもち" src="omochi-avatar.png" />
        <Balloon>
          お世話してくれた結果を見れるカレンダーだよ！
          日付をタップすると、誰がお世話してくれたかも確認できるよ🐇❤
        </Balloon>
      </Flex>
    </>
  );
};
