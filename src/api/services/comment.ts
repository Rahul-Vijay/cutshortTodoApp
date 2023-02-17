import Comment from "@todoapp/api/models/comment";

function getComments(userId: string, limit: number, page: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const allComments = await Comment.fetchPostComments(userId, limit, page);
      resolve(allComments);
    } catch (error) {
      reject({
        error: {
          type: "comment_get_error",
          message: "Could not get Comments",
          errorMessage: "",
        },
      });
    }
  });
}

export default { getComments };
