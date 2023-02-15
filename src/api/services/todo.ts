import { IdResponse } from "@todoapp/api/interfaces/interfaces";
import Todo from "@todoapp/api/models/todo";
import { Error } from "mongoose";

function postANewTodo(text: string, userId: string): Promise<IdResponse> {
  return new Promise(async (resolve, reject) => {
    const todo = new Todo({ text, userId, completed: false });
    try {
      await todo.save();
      resolve({ id: todo._id });
    } catch (error: any) {
      let errorMessage;
      if (error instanceof Error.ValidationError) {
        errorMessage = (error as Error.ValidationError).message;
      }
      reject({
        error: {
          type: "todo_post_error",
          message: "Could not post Todo",
          errorMessage,
        },
      });
    }
  });
}

export default { postANewTodo: postANewTodo };
