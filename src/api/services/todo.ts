import { BoolResponse, IdResponse } from "@todoapp/api/interfaces/interfaces";
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
          message: "Could not get Todos",
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

function updateTodoText(text: string, todoId: string): Promise<BoolResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      await Todo.updateText(todoId, text);
      resolve({ status: true });
    } catch (error) {
      reject({
        error: {
          type: "todo_patch_error",
          message: "Could not update",
          errorMessage: "",
        },
      });
    }
  });
}

function updateTodoStatus(
  completed: boolean,
  todoId: string
): Promise<BoolResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      if (completed) {
        await Todo.markAsCompleted(todoId);
      } else {
        await Todo.markAsIncomplete(todoId);
      }

      resolve({ status: true });
    } catch (error) {
      reject({
        error: {
          type: "todo_patch_error",
          message: "Could not update",
          errorMessage: "",
        },
      });
    }
  });
}

export default { postANewTodo, getTodos, updateTodoText, updateTodoStatus };
