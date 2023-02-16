import { Schema, Document, model, Model } from "mongoose";

export interface ICommentDocument extends Document {
  text: string;
  userId: string;
  postId: string;
  created: Date;
}

export interface IComment extends ICommentDocument {}

export interface ICommentModel extends Model<IComment> {}

const commmentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    created: { type: Date, default: Date.now },
  },
  { strict: true }
);

commmentSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.created = ret.created.getTime();
    delete ret.__v;
  },
});

export const Comment: ICommentModel = model<IComment, ICommentModel>(
  "Comment",
  commmentSchema
);

export default Comment;
