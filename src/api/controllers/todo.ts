import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";

export function getTodo(req: express.Request, res: express.Response): void {
  const userId = req.query.userId || "12345";
  const fakeTokenId = res.locals.auth.userId;
  const message = `Hello, ${userId}, with ${fakeTokenId}!`;
  writeJsonResponse(res, 200, { message });
}
