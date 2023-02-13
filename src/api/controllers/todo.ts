import * as express from "express";
import { writeJsonResponse } from "../../utils/express";

export function getTodo(req: express.Request, res: express.Response): void {
  const userId = req.query.userId || "12345";
  const message = `Hello, ${userId}!`;
  writeJsonResponse(res, 200, { message });
}

export function goodbye(req: express.Request, res: express.Response): void {
  const userId = res.locals.auth.userId;
  writeJsonResponse(res, 200, { message: `Goodbye, ${userId}!` });
}
