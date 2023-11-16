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
  email: string;
  date: string;
  text: string;
  upvotes: string[];
  downvotes: string[];
  comments: Comments[];
}

const CommentSchema = new Schema<Comments>({
  email: { type: String },
  date: { type: String },
  text: { type: String },
  upvotes: { type: Number },
  downvotes: { type: Number },
});

const PostSchema = new Schema<Posts>(
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
  { collection: "posts" }
);

function getPostModel() {
  //console.log(mongoose.model("Post", PostSchema));
  if ("Post" in mongoose.models) return mongoose.models.Post;
  return mongoose.model("Post", PostSchema);
}

export default getPostModel;
