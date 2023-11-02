import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Comments {
  email: string;
  username: string;
  date: string;
  text: string;
  upvotes: number;
  downvotes: number;
}
export interface Posts {
  title: string;
  post_id: number;
  username: string;
  email: string;
  date: string;
  text: string;
  upvotes: string[];
  downvotes: string[];
  comments: (typeof CommentSchema)[];
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
    post_id: { type: Number },
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

function getPostModel() {
  if ("Post" in mongoose.models) return mongoose.models.Post;
  return mongoose.model("Post", PostSchema);
}
export default getPostModel;
