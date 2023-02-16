import Post from "@todoapp/api/models/post";
import db from "@todoapp/utils/db";
import Comment from "@todoapp/api/models/comment";

beforeAll(async () => {
  await db.open();
});

afterAll(async () => {
  await db.close();
});

describe("save", () => {
  const text = "this is a post text";
  const userId = "123";
  const post = new Post({ text, userId });

  it("should create a new post", async () => {
    await post.save();

    const fetched = await Post.findById(post._id);
    expect(fetched).not.toBeNull();

    expect(fetched!.text).toBe(text);
    expect(fetched!.userId).toBe(userId);
    expect(fetched!.comments.length).toBe(0);
  });
});

describe("comments", () => {
  const text = "this is a post text";
  const userId = "123";
  const post = new Post({ text, userId });

  it("should add a new comment", async () => {
    await post.save();

    await Post.addComment("new comment", "123", post._id);

    const fetched = await Post.findById(post._id);
    expect(fetched!.comments.length).toBe(1);
    expect(fetched!.comments[0].text).toBe("new comment");
    expect(fetched!.comments[0].userId).toBe("123");
    expect(fetched!.comments[0].postId).toBe(String(post._id));
  });

  it("should add upto 10 comments only", async () => {
    await post.save();

    await Post.addComment("1", "12345", post._id);
    await Post.addComment("2", "12345", post._id);
    await Post.addComment("3", "12345", post._id);
    await Post.addComment("4 new comment", "12345", post._id);
    await Post.addComment("5 new comment", "12345", post._id);
    await Post.addComment("6 new comment", "12345", post._id);
    await Post.addComment("7vnew comment", "12345", post._id);
    await Post.addComment("8 new comment", "12345", post._id);
    await Post.addComment("9 new comment", "12345", post._id);
    await Post.addComment("10 new comment", "12345", post._id);
    await Post.addComment("11 new comment", "12345", post._id);

    const fetched = await Post.findById(post._id);
    expect(fetched!.comments.length).toBe(10);
    const fetchedComments = await Comment.find({});
    expect(fetchedComments!.length).toBe(2);
  });
});
