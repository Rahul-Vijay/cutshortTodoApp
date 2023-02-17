import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";

import CommentService from "@todoapp/api/services/comment";

export async function getComments(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { limit = 5, page = 1 } = req.query;
  const userId = req.query.userId as string;

  try {
    const data = await CommentService.getComments(
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
      fn: "getComments",
    });
  }
}
