import { Posts } from "../models/Post";
import { Comments } from "../models/Post";
import genUniqueId from "../lib/idGen";

export const flagPost = async (status: boolean, message: string, flagger: string, post_id: string) => {
  try {
    const res = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        flagged: status,
        flagMessage: message,
        flaggerEmail: flagger
      }),
    });
    if (!res) throw new Error("Internal server error");
    const resJson = await res.json();
    if (res.status !== 200) throw new Error(resJson.data);
    console.log("successfully flagged", resJson.data);
  } catch (e: Error | any) {
    console.error("Error flagging", e);
    return { success: false, error: e };
  }
};
export const flagComment = async (status: boolean, message: string, flagger: string, post_id: string, comment_id : string) => {
  try {
    const res = await fetch(`/api/posts/${post_id}`, {
      method: "GET",
    });
    if (!res) throw new Error("Internal server error");
    const resJson = await res.json();
    if (res.status !== 200) throw new Error(resJson.data);
    let comments : Comments[] = resJson.data.comments
    for (let i = 0; i < comments.length; i++)
      if (comments[i].comment_id == comment_id) {
        comments[i].flagged =status
        comments[i].flaggedDate = ""
        comments[i].flagMessage = message 
        comments[i].flaggerEmail = flagger
      }

    
    const resFlag = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        flaggedComment: status,
        comments: comments
      }),
    });
    if (!resFlag) throw new Error("Internal server error");
    const resFlagJson = await res.json();
    if (res.status !== 200) throw new Error(resFlagJson.data);
    console.log("successfully flagged", resFlagJson.data);
  } catch (e: Error | any) {
    console.error("Error flagging", e);
    return { success: false, error: e };
  }
};

export const postComment = async (newComment: Comments, post_id: string) => {
  try {
    console.log(post_id);
    const res = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        $push: { comments: { $each: [newComment], $position: 0 } },
      }),
    });
    if (!res) throw new Error("Internal server error");
    const resJson = await res.json();
    if (res.status !== 200) throw new Error(resJson.data);
    console.log("successfully posted", resJson.data);
  } catch (e: Error | any) {
    console.error("Error posting", e);
    return { success: false, error: e };
  }
};

export const deletePost = async (postId: string) => {
  // move the post by moving it from posts to deletedPosts
  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "GET",
    });

    if (!res) throw new Error("Internal Server Error");

    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.data);
    }

    const post = resJson.data;

    const deleteRes = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (!deleteRes) throw new Error("Internal Server Error");
    const deleteResJson = await deleteRes.json();
    if (!deleteRes.ok) throw new Error(deleteResJson.data);

    const pushRes = await fetch(`/api/deletedPosts/${postId}`, {
      method: "POST",
      body: JSON.stringify(post),
    });

    if (!pushRes) throw new Error("Internal Server Error");
    const pushResJson = await pushRes.json();

    if (!pushRes.ok) throw new Error(pushResJson.data);
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};
export default postComment;
//comment
