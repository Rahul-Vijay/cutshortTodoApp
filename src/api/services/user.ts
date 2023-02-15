import { IdResponse } from "@todoapp/api/interfaces/interfaces";

function auth(bearerToken: string): Promise<IdResponse> {
  return new Promise(function (resolve, reject) {
    const token = bearerToken.replace("Bearer ", "");
    if (token === "fakeToken") {
      resolve({ id: "fakeUserId" });
      return;
    }

    resolve({
      error: {
        type: "unauthorized",
        message: "Authentication Failed",
        errorMessage: "",
      },
    });
  });
}

export default { auth: auth };
