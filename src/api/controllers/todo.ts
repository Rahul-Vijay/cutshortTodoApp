import * as express from "express";

export function getTodo(req: express.Request, res: express.Response): void {
  const userId = req.query.userId || "12345";
  const message = `Hello, ${userId}!`;
  res.json({
    message: message,
  });
}
