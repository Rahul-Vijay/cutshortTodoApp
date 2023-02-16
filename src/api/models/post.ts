import { Schema, Document, model, Model } from "mongoose";
import { ICommentDocument } from "./comment";

interface IPostDocument extends Document {
  text: string;
  userId: string;
  comments: ICommentDocument[];
  created: Date;
}

export interface IPost extends IPostDocument {}

export interface IPostModel extends Model<IPost> {}

// set max comments array size as 10
// rest of the comments to load from a different collection
function arrayLimit(val: ICommentDocument[]): Boolean {
  return val.length < 11;
}

const postSchema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    comments: {
      type: [],
      validate: [arrayLimit, "maximum comments within document"],
    },
    created: { type: Date, default: Date.now },
  },
  { strict: true }
);

postSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.created = ret.created.getTime();
    delete ret.__v;
  },
});

export const Post: IPostModel = model<IPost, IPostModel>("Post", postSchema);

export default Post;
