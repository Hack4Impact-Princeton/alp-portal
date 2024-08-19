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
  pfpLink: string;
  username: string;
  email: string;
  date: string;
  text: string;
  upvotes: string[];
  downvotes: string[];
  comments: Comments[];
  is_public?: boolean;
  flagged: boolean;
  flagMessage: string;
  flaggerEmail: string;
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
    pfpLink: {type: String},
    username: { type: String },
    email: { type: String },
    date: { type: String },
    text: { type: String },
    upvotes: { type: [String] },
    downvotes: { type: [String] },
    comments: { type: [CommentSchema] },
    is_public: { type: Boolean },
    flagged: {type: Boolean},
    flagMessage: {type: String},
    flaggerEmail: {type: String}
  },
  { collection: "posts" }
);

// TODO not dry
const DeletedPostSchema = new Schema<Posts>(
  {
    title: { type: String },
    post_id: { type: String },
    pfpLink: {type: String},
    email: { type: String },
    date: { type: String },
    text: { type: String },
    upvotes: { type: [String] },
    downvotes: { type: [String] },
    comments: { type: [CommentSchema] },
    is_public: { type: Boolean },
    flagged: {type: Boolean},
    flagMessage: {type: String},
    flaggerEmail: {type: String}
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
