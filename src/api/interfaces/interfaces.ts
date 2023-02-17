export type ErrorResponse = {
  error: { type: string; message: string; errorMessage: string };
};
export type IdResponse = ErrorResponse | { id: string };
export type BoolResponse = ErrorResponse | { status: boolean };
export type LoginUserResponse =
  | ErrorResponse
  | {
      userId: string;
      token: string;
      expireAt: Date;
    };
