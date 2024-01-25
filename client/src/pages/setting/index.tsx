import { Flex, Avatar } from "@chakra-ui/react";
import { Balloon } from "../../components/Balloon";
import { Header } from "../../components/Header";
import { Setting } from "../../features/Setting/components/Setting";

export const SettingHandler = () => {
  return (
    <div style={{ marginTop: "56px" }}>
      <Header />
      <Flex alignItems="center" justifyContent="center" mx={5}>
        <Avatar w="70px" h="70px" name="おもち" src="omochi-avatar.png" />
        <Balloon>
          ユーザ情報のページだよ！変更時は僕の下にあるボタンを押下してね🐇❤
        </Balloon>
      </Flex>
      <Setting />
    </div>
  );
};
