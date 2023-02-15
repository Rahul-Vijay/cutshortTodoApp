export type ErrorResponse = { error: { type: string; message: string } };
export type IdResponse = ErrorResponse | { id: string };
