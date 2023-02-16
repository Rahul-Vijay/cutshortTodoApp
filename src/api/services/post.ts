import Post from "@todoapp/api/models/post";
import { BoolResponse, IdResponse } from "../interfaces/interfaces";

function getPosts(userId: string, limit: number, page: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const allPosts = await Post.fetchUserPosts(userId, limit, page);
      resolve(allPosts);
    } catch (error) {
      reject({
        error: {
          type: "post_get_error",
          message: "Could not get Posts",
          errorMessage: "",
        },
      });
    }
  });
}

function addANewPost(text: string, userId: string): Promise<IdResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const post = new Post({ text, userId });
      await post.save();
      resolve({ id: post._id });
    } catch (error) {
      reject({
        error: {
          type: "post_error",
          message: "Could not add a new Post",
          errorMessage: "",
        },
      });
    }
  });
}

function addCommentToPost(
  userId: string,
  postId: string,
  text: string
): Promise<BoolResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const status = await Post.addComment(text, userId, postId);
      resolve({ status });
    } catch (error) {
      reject({
        error: {
          type: "post_comment_error",
          message: "Could not post a new comment to Post",
          errorMessage: "",
        },
      });
    }
  });
}

export default { getPosts, addANewPost, addCommentToPost };
