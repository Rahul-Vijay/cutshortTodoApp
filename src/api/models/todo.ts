import { Schema, Document, model, Model } from "mongoose";

interface ITodoDocument extends Document {
  text: string;
  completed: boolean;
  created: Date;
}

export interface ITodo extends ITodoDocument {}

const todoSchema = new Schema<ITodo>(
  {
    text: { type: String, required: true },
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

export interface ITodoModel extends Model<ITodo> {}

export const Todo: ITodoModel = model<ITodo, ITodoModel>("Todo", todoSchema);

export default Todo;
