export type InputsType = {
  emailOrUserid: string | undefined;
  password: string;
};

export type LoginResult = {
  message: string;
  user: User | null;
  token: string | null;
};
