import { Schema, Document, model, Model } from "mongoose";
import Comment, { ICommentDocument } from "./comment";

interface IPostDocument extends Document {
  text: string;
  userId: string;
  comments: ICommentDocument[];
  filled: boolean;
  created: Date;
}

export interface IPost extends IPostDocument {}

export interface IPostModel extends Model<IPost> {
  fetchUserPosts(
    userId: string,
    limit: number,
    page: number
  ): Promise<IPostDocument[]>;
  addComment(text: string, userId: string, postId: string): Promise<Boolean>;
}

// set max comments array size as 10
// rest of the comments to load from a different collection
function arrayLimit(val: ICommentDocument[]): Boolean {
  return val.length < 11;
}

const postSchema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    filled: { type: Boolean, default: false },
    comments: {
      type: [],
      default: [],
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

postSchema.statics.fetchUserPosts = async function (
  userId: string,
  limit: number,
  page: number
) {
  const posts = await this.find({ userId })
    .sort({ created: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  return posts;
};

postSchema.statics.addComment = async function (
  text: string,
  userId: string,
  postId: string
): Promise<Boolean> {
  try {
    const post = await this.findById(postId);
    if (post != null) {
      const comment = new Comment({
        text,
        userId,
        postId,
      });
      if (!post.filled) {
        let newComments = [...post.comments];
        newComments.push(comment);
        post.comments = newComments;
        if (newComments.length == 10) {
          post.filled = true;
        }
        await post.save();
      } else {
        await comment.save();
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const Post: IPostModel = model<IPost, IPostModel>("Post", postSchema);

export default Post;
