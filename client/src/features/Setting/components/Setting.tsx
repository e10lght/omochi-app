import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUsersStore } from "../../../stores/useUsersStore";
import { User } from "../../../types/users";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LoadingModal } from "../../../components/LoadingModal";

const schema = z.object({
  name: z.string().min(1, "必須項目です"),
  email: z.string().min(1, "必須項目です"),
  password: z
    .string()
    .min(1, "必須項目です")
    .min(8, "パスワードは8文字以上で入力してください"),
});

type UpdatableUser = {
  name: string;
  email: string;
  password: string;
};

export const Setting = () => {
  const { onClose } = useDisclosure();
  const toast = useToast();

  const { getLoggedInUser, updateUser } = useUsersStore();

  const [userInfo, setUserInfo] = useState<User | null>();
  const [changeFlg, setChangeFlg] = useState<boolean>(false);
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<UpdatableUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    setIsLoading(true);

    getLoggedInUser().then((data) => {
      setUserInfo(data.user);
      reset({
        name: data.user?.name,
        email: data.user?.email,
      });
      setIsLoading(false);
    });
  }, []);

  const onSubmit: SubmitHandler<UpdatableUser> = async (data) => {
    const updatedUser = await updateUser(data);
    if (updatedUser.status !== 200) {
      setError("root", {
        type: "server",
        message: updatedUser.error || "登録できませんでした",
      });
    } else {
      toast({
        title: "変更が完了しました",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  };

  return (
    <>
      <LoadingModal isLoading={isLoading} onClose={onClose} />

      <Button
        my={3}
        mx={2}
        border="1px solid #333"
        size="sm"
        onClick={() => setChangeFlg((prev) => !prev)}
      >
        登録情報を変更する
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} mx={2}>
          <label htmlFor="name">
            <Text fontWeight="bold">名前</Text>
          </label>
          <Input
            id="name"
            placeholder="name"
            {...register("name")}
            disabled={!changeFlg}
            bg="aliceblue"
            defaultValue={userInfo?.name}
          />
          {typeof errors.name?.message === "string" ? (
            <p>{errors.name.message}</p>
          ) : null}

          <label htmlFor="email">
            <Text fontWeight="bold">メールアドレス</Text>
          </label>
          <Input
            id="email"
            placeholder="email"
            type="email"
            {...register("email")}
            disabled={!changeFlg}
            bg="aliceblue"
            defaultValue={userInfo?.email}
          />
          {typeof errors.email?.message === "string" ? (
            <p>{errors.email.message}</p>
          ) : null}

          <label htmlFor="password">
            <Text fontWeight="bold">パスワード</Text>
          </label>
          <InputGroup size="md">
            <Input
              id="password"
              placeholder="半角英数字8文字以上"
              type={isRevealPassword ? "text" : "password"}
              {...register("password")}
              disabled={!changeFlg}
              bg="aliceblue"
            />
            <InputRightElement width="4.5rem">
              <span onClick={togglePassword} role="presentation">
                {isRevealPassword ? <ViewIcon /> : <ViewOffIcon />}
              </span>
            </InputRightElement>
          </InputGroup>
          {typeof errors.password?.message === "string" ? (
            <p>{errors.password.message}</p>
          ) : null}

          {errors.root?.message ? <p>{errors.root.message}</p> : null}
          <Button
            type="submit"
            w="100%"
            bg="yellow.800"
            color="gray.100"
            _hover={{
              bg: "yellow.400",
            }}
            isDisabled={!changeFlg || isSubmitting}
          >
            変更する
          </Button>
        </Stack>
      </form>
    </>
  );
};
