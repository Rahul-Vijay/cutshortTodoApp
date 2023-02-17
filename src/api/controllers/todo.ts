import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";
import TodoService from "@todoapp/api/services/todo";
import jwt from "jsonwebtoken";

export async function getTodo(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { limit = 5, page = 1 } = req.query;
  const userId = req.query.userId as string;
  try {
    const authToken = req.headers.authorization!;

    const decoded = jwt.verify(authToken, "secretKeyyyy") as {
      userId: string;
      role: string;
    };

    // only allow users & admins to get todos
    if (decoded.userId == userId || decoded.role == "admin") {
      const data = await TodoService.getTodos(
        userId,
        Number(limit),
        Number(page)
      );
      writeJsonResponse(res, 200, {
        message: "resolved",
        data,
      });
    } else {
      writeJsonResponse(res, 400, {
        message: "Unauthorized",
        fn: "getTodo",
      });
    }
  } catch (error) {
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "getTodo",
    });
  }
}

export async function postTodo(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, userId } = req.body;
  try {
    // only allow users to post their own todos
    const authToken = req.headers.authorization!;

    const decoded = jwt.verify(authToken, "secretKeyyyy") as {
      userId: string;
      role: string;
    };
    if (decoded.userId == userId) {
      const todoId = await TodoService.postANewTodo(text, userId);
      writeJsonResponse(res, 201, { message: "Todo Created", ...todoId });
    }
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

export async function updateTodoText(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, todoId } = req.body;
  try {
    const todoStatus = await TodoService.updateTodoText(text, todoId);
    writeJsonResponse(res, 201, {
      message: "Todo Text Updated",
      ...todoStatus,
    });
  } catch (error: any) {
    console.log(error);
    if (error.error != undefined) {
      if (error.error.type == "todo_patch_error")
        writeJsonResponse(res, 400, {
          message: error.error.errorMessage,
          fn: "updateTodo",
        });
      return;
    }
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "updateTodo",
    });
  }
}

export async function updateTodoStatus(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { completed, todoId } = req.body;
  try {
    const todoStatus = await TodoService.updateTodoStatus(completed, todoId);
    writeJsonResponse(res, 201, {
      message: "Todo Status Updated",
      ...todoStatus,
    });
  } catch (error: any) {
    console.log(error);
    if (error.error != undefined) {
      if (error.error.type == "todo_patch_error")
        writeJsonResponse(res, 400, {
          message: error.error.errorMessage,
          fn: "updateTodoStatus",
        });
      return;
    }
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "updateTodoStatus",
    });
  }
}
