import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";
import TodoService from "@todoapp/api/services/todo";

export async function getTodo(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { limit = 5, page = 1 } = req.query;
  const userId = req.query.userId as string;

  try {
    const data = await TodoService.getTodos(
      userId,
      Number(limit),
      Number(page)
    );
    writeJsonResponse(res, 200, {
      message: "resolved",
      data,
    });
  } catch (error) {
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "getTodo",
    });
  }

  // writeJsonResponse(res, 200, { message });
}

export async function postTodo(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, userId } = req.body;
  try {
    const todoId = await TodoService.postANewTodo(text, userId);
    writeJsonResponse(res, 201, { message: "Todo Created", ...todoId });
  } catch (error: any) {
    console.log(error);
    if (error.error != undefined) {
      if (error.error.type == "todo_post_error")
        writeJsonResponse(res, 400, {
          message: error.error.errorMessage,
          fn: "postTodo",
        });
      return;
    }
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "postTodo",
    });
  }
}
