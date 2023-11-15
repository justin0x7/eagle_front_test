export type LoginUserProps = {
  email: string;
  password: string;
};

export type SignUpUserProps = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserProps = {
  newUsername: string;
  email: string;
  newPassword: string;
};

export type ForgotPasswordProps = {
  email: string;
};

