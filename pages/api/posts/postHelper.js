import fetch from "node-fetch";
import dbConnect from "../../../lib/dbConnect.js";
import getPostModel from "../../../models/Post.js";
// import fetchAbsolute from "fetch-absolute";

const BASE = "http://localhost:3000/";

export async function createPost(alp_id, title, text){
    await dbConnect()
    const Post = getPostModel();
    const data = {
        title: title,   
        post_id: await Post.count(),
        alp_id: alp_id,
        date: "placeholder",
        text: text,
        upvotes: [],
        downvotes: [],
        comments: []
    }
    const res = await fetch(BASE + 'api/posts/' + data.post_id, {
        method: "POST",
        body: JSON.stringify(data),
    })
   return data;
}

export async function upvotePost(alp_id, post_id) {
    let data = await fetch(BASE + 'api/posts/' + post_id, {
        method: "GET"
    }).then(res => res.json()).then(res => res.data)
    if (data.upvotes.includes(alp_id)) return data;
    if (data.downvotes.includes(alp_id)) 
        data.downvotes = data.downvotes.filter(id => id != alp_id)
    data.upvotes.push(alp_id);
    await fetch(BASE + 'api/posts/' + post_id, {
        method: "PUT",
        body: JSON.stringify(data)
    })
    return data;
}

export async function downvotePost(alp_id, post_id) {
    let data = await fetch(BASE + 'api/posts/' + post_id, {
        method: "GET"
    }).then(res => res.json()).then(res => res.data)
    if (data.downvotes.includes(alp_id)) return data;
    if (data.upvotes.includes(alp_id)) 
        data.upvotes = data.upvotes.filter(id => id != alp_id)
    data.downvotes.push(alp_id);
    await fetch(BASE + 'api/posts/' + post_id, {
        method: "PUT",
        body: JSON.stringify(data)
    })
    return data;
}

export async function deletePost(post_id) {
    let res = await fetch(BASE + 'api/posts/' + post_id, {
        method: "DELETE"
    }).then(res => res.json())
    return res.success;
}


