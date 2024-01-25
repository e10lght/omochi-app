import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { InputsType } from "../types/login";
import { useLoginStore } from "../../../stores/useLoginStore";
import { Button, Input, Stack, Text } from "@chakra-ui/react";

const schema = z.object({
  emailOrUserid: z.string().min(1, "必須項目です"),
  password: z
    .string()
    .min(1, "必須項目です")
    .min(8, "パスワードは8文字以上で入力してください"),
});

export const Login = () => {
  const { postLogin } = useLoginStore();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<InputsType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<InputsType> = async (data) => {
    const res = await postLogin(data);
    if (res.status !== 200) {
      setError("root", { type: "server", message: res.message });
    } else {
      navigate("/home");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} mx={2}>
          <label htmlFor="emailOrUserid">
            <Text fontWeight="bold">ユーザIDまたはメールアドレス</Text>
          </label>
          <Input
            id="emailOrUserid"
            placeholder="useridまたはemail"
            bg="aliceblue"
            {...register("emailOrUserid")}
          />
          {typeof errors.emailOrUserid?.message === "string" ? (
            <p>{errors.emailOrUserid.message}</p>
          ) : null}

          <label htmlFor="password">
            <Text fontWeight="bold">パスワード</Text>
          </label>
          <Input
            id="password"
            placeholder="パスワード"
            type="password"
            bg="aliceblue"
            {...register("password")}
          />
          {typeof errors.password?.message === "string" ? (
            <p>{errors.password.message}</p>
          ) : null}

          {errors.root?.message ? <p>{errors.root.message}</p> : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            w="100%"
            bg="yellow.800"
            color="gray.100"
            _hover={{
              bg: "yellow.400",
            }}
          >
            ログイン
          </Button>
        </Stack>
      </form>
    </>
  );
};
