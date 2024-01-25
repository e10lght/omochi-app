import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { OmochiBaloon } from "../../components/OmochiBaloon";
import { Care } from "../../features/Care/components/Care";
import { CareRanking } from "../../features/Ranking/components/Ranking";
import { useUsersStore } from "../../stores/useUsersStore";
import { User } from "../../types/users";

export const HomeHandler = () => {
  const { getLoggedInUser } = useUsersStore();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getLoggedInUser().then((res) => {
      if (res.user) {
        setUser(res.user);
      }
    });
  }, []);

  return (
    <>
      <div style={{ marginTop: "56px" }}>
        <Header />
        <Stack spacing={4} mt={10}>
          <OmochiBaloon>
            {user ? user?.name : ""}
            さん、いつもお世話してくれてありがとう🐇❤
          </OmochiBaloon>
          <Care />
          <CareRanking />
        </Stack>
      </div>
    </>
  );
};
