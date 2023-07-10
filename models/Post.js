import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        alp_id: {type: String},
        date: {type: String},
        text: {type: String},
        upvotes: {type: Number},
        downvotes: {type: Number}
    }
);

const PostSchema = new Schema (
    {
        title: {type: String},
        post_id: {type: Number},
        alp_id: {type: String},
        date: {type: String},
        text: {type: String},
        upvotes: {type: [String]},
        downvotes: {type: [String]},
        comments: {type: [CommentSchema]}
    },
    { collection: "posts" }
);

function getPostModel() {
  if ("Post" in mongoose.models) return mongoose.models.Post;
  return mongoose.model("Post", PostSchema);
}
export default getPostModel;
