import * as express from "express";

import UserService from "@todoapp/api/services/user";
import { writeJsonResponse } from "@todoapp/utils/express";

export function auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = req.headers.authorization!;
  UserService.auth(token)
    .then((authResponse) => {
      if (!(authResponse as any).error) {
        res.locals.auth = {
          userId: (authResponse as { id: string }).id,
        };
        next();
      } else {
        writeJsonResponse(res, 401, authResponse);
      }
    })
    .catch((err) => {
      console.log(err);
      writeJsonResponse(res, 500, {
        error: {
          type: "internal_server_error",
          message: "Internal Server Error",
        },
      });
    });
}
