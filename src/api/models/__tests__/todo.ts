import { faker } from "@faker-js/faker";

import Todo from "@todoapp/api/models/todo";
import db from "@todoapp/utils/db";

beforeAll(async () => {
  await db.open();
});

afterAll(async () => {
  await db.close();
});

describe("save", () => {
  const text = "This is some todo text";
  const completed = false;
  const userId = "123";
  const todo = new Todo({ text: text, completed: completed, userId: userId });

  it("should create todo", async () => {
    await todo.save();

    const fetched = await Todo.findById(todo._id);
    expect(fetched).not.toBeNull();

    expect(fetched!.text).toBe(text);
    expect(fetched!.completed).toBe(completed);
  });

  it("should mark todo as completed", async () => {
    await todo.save();

    await Todo.markAsCompleted(todo._id);
    const updatedTodo = await Todo.findById(todo._id);

    expect(updatedTodo!.completed).toBe(true);
  });

  it("should update todo text", async () => {
    const newText = "This is some new text";
    await todo.save();

    await Todo.updateText(todo._id, newText);
    const updatedTodo = await Todo.findById(todo._id);

    expect(updatedTodo!.text).toBe(newText);
  });

  it("should get all todos of user", async () => {
    await Todo.insertMany([
      { userId: "1", text: "1 text", completed: false },
      { userId: "1", text: "2 text", completed: false },
      { userId: "1", text: "3 text", completed: false },
      { userId: "1", text: "11 text", completed: false },
      { userId: "1", text: "111 text", completed: false },
      { userId: "1", text: "112 text", completed: false },
      { userId: "1", text: "113 text", completed: false },
      { userId: "1", text: "114 text", completed: false },
      { userId: "1", text: "115 text", completed: false },
    ]);
    const firstBatchOfFive = await Todo.getAllTodosOfUser("1", 5, 1);
    const secondBatchOfFive = await Todo.getAllTodosOfUser("1", 5, 2);

    expect(firstBatchOfFive.length).toBe(5);
    expect(secondBatchOfFive.length).toBe(4);

    const firstBatchOfEight = await Todo.getAllTodosOfUser("1", 8, 1);
    const secondBatchOfEight = await Todo.getAllTodosOfUser("1", 8, 2);

    expect(firstBatchOfEight.length).toBe(8);
    expect(secondBatchOfEight.length).toBe(1);
  });
});
