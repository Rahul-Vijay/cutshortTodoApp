import { Schema, Document, model, Model } from "mongoose";

interface ITodoDocument extends Document {
  text: string;
  completed: boolean;
  userId: string;
  created: Date;
}

export interface ITodo extends ITodoDocument {}
export interface ITodoModel extends Model<ITodo> {
  markAsCompleted(id: string): Promise<void>;
  updateText(id: string, text: string): Promise<void>;
  getAllTodosOfUser(
    userId: string,
    limit: number,
    page: number
  ): Promise<ITodoDocument[]>;
}

const todoSchema = new Schema<ITodo>(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    completed: { type: Boolean, required: true },
    created: { type: Date, default: Date.now },
  },
  { strict: true }
);

todoSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.created = ret.created.getTime();
    delete ret.__v;
  },
});

todoSchema.statics.markAsCompleted = async function (id: string) {
  await this.updateOne({ _id: id }, { completed: true });
};

todoSchema.statics.updateText = async function (id: string, text: string) {
  await this.updateOne({ _id: id }, { text: text });
};

todoSchema.statics.getAllTodosOfUser = async function (
  userId: string,
  limit: number,
  page: number
) {
  const todos = await this.find({ userId })
    .sort({ created: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  return todos;
};

export const Todo: ITodoModel = model<ITodo, ITodoModel>("Todo", todoSchema);

export default Todo;
