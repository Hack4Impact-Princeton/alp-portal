import { Posts } from "../models/Post";
import { Comments } from "../models/Post";
import genUniqueId from "../lib/idGen";
import React, { useState } from "react";

export const postComment = async (newComment: Comments, post_id: string) => {
  try {
    console.log(post_id);
    const res = await fetch(`/api/posts/${post_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ comments: [newComment] }),
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
