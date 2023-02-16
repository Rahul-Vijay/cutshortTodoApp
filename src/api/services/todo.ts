import { IdResponse } from "@todoapp/api/interfaces/interfaces";
import Todo from "@todoapp/api/models/todo";
import { Error } from "mongoose";

function getTodos(userId: string, limit: number, page: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const allTodos = await Todo.getAllTodosOfUser(userId, limit, page);
      resolve(allTodos);
    } catch (error) {
      reject({
        error: {
          type: "todo_get_error",
          message: "Could not get trades",
          errorMessage: "",
        },
      });
    }
  });
}

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

export default { postANewTodo, getTodos };
