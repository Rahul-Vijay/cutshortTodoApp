import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";
import TodoService from "@todoapp/api/services/todo";

export function getTodo(req: express.Request, res: express.Response): void {
  const userId = req.query.userId || "12345";
  const fakeTokenId = res.locals.auth.userId;
  const message = `Hello, ${userId}, with ${fakeTokenId}!`;
  writeJsonResponse(res, 200, { message });
}

export async function postTodo(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, userId } = req.body;

  try {
    const todoId = await TodoService.postANewTodo(text, userId);
    writeJsonResponse(res, 201, { message: "Todo Created", id: todoId });
  } catch (error) {
    console.log(error);
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      status: "postTodo",
    });
  }

  const fakeTokenId = res.locals.auth.userId;
  const message = `Hello, ${userId}, with ${fakeTokenId}!`;
  writeJsonResponse(res, 200, { message });
}
