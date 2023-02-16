import { Schema, Document, model, Model } from "mongoose";

export interface ICommentDocument extends Document {
  text: string;
  userId: string;
  postId: string;
  created: Date;
}

export interface IComment extends ICommentDocument {}

export interface ICommentModel extends Model<IComment> {
  fetchPostComments(
    postId: string,
    limit: number,
    page: number
  ): Promise<ICommentDocument[]>;
}

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

commmentSchema.statics.fetchPostComments = async function (
  postId: string,
  limit: number,
  page: number
) {
  const comments = await this.find({ postId })
    .sort({ created: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  return comments;
};

export const Comment: ICommentModel = model<IComment, ICommentModel>(
  "Comment",
  commmentSchema
);

export default Comment;
