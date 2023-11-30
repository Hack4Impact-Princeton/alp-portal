import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Comments {
  email: string;
  date: string;
  text: string;
  upvotes: number;
  downvotes: number;
  comment_id: string;
  username: string;
}

export interface Posts {
  title: string;
  post_id: string;
  username: string;
  email: string;
  date: string;
  text: string;
  upvotes: string[];
  downvotes: string[];
  comments: Comments[];
}

const CommentSchema = new Schema<Comments>({
  email: { type: String },
  username: { type: String },
  date: { type: String },
  text: { type: String },
  upvotes: { type: Number },
  downvotes: { type: Number },
});

const PostSchema = new Schema<Posts>(
  {
    title: { type: String },
    post_id: { type: String },
    username: { type: String },
    email: { type: String },
    date: { type: String },
    text: { type: String },
    upvotes: { type: [String] },
    downvotes: { type: [String] },
    comments: { type: [CommentSchema] },
  },
  { collection: "posts" }
);

// TODO not dry
const DeletedPostSchema = new Schema<Posts>(
  {
    title: { type: String },
    post_id: { type: String },
    email: { type: String },
    date: { type: String },
    text: { type: String },
    upvotes: { type: [String] },
    downvotes: { type: [String] },
    comments: { type: [CommentSchema] },
  },
  { collection: "deletedPosts" }
);

function getPostModel() {
  if ("Post" in mongoose.models) return mongoose.models.Post;
  return mongoose.model("Post", PostSchema);
}

function getDeletedPostModel() {
  if ("DeletedPost" in mongoose.models) return mongoose.models.DeletedPost;
  return mongoose.model("DeletedPost", DeletedPostSchema);
}

export default getPostModel;
export { getDeletedPostModel };
