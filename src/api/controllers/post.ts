import * as express from "express";
import { writeJsonResponse } from "@todoapp/utils/express";

import PostService from "@todoapp/api/services/post";

export async function getPosts(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { limit = 5, page = 1 } = req.query;
  const userId = req.query.userId as string;

  try {
    const data = await PostService.getPosts(
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
      fn: "getPosts",
    });
  }
}

export async function addPost(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, userId } = req.body;
  try {
    const postId = await PostService.addANewPost(text, userId);
    writeJsonResponse(res, 201, { message: "Post Created", ...postId });
  } catch (error: any) {
    console.log(error);
    if (error.error != undefined) {
      if (error.error.type == "post_add_error")
        writeJsonResponse(res, 400, {
          message: error.error.errorMessage,
          fn: "addPost",
        });
      return;
    }
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "addPost",
    });
  }
}

export async function addComment(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text, userId, postId } = req.body;
  try {
    const commentId = await PostService.addCommentToPost(userId, postId, text);
    writeJsonResponse(res, 201, { message: "Comment Added", ...commentId });
  } catch (error: any) {
    console.log(error);
    if (error.error != undefined) {
      if (error.error.type == "post_add_error")
        writeJsonResponse(res, 400, {
          message: error.error.errorMessage,
          fn: "addComment",
        });
      return;
    }
    writeJsonResponse(res, 500, {
      message: "Internal Server Error",
      fn: "addComment",
    });
  }
}
