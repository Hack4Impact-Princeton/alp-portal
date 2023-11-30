import { Posts } from "../models/Post";

export const deletePost = async (postId: string) => {
    // move the post by moving it from posts to deletedPosts
    try {
        const res = await fetch(`/api/posts/${postId}`, {
            method: "GET"
        })

        if (!res) throw new Error("Internal Server Error")

        const resJson = await res.json()

        if (!res.ok) { throw new Error(resJson.data) }

        const post = resJson.data

        const deleteRes = await fetch(`/api/posts/${postId}`, {
            method: "DELETE"
        })

        if (!deleteRes) throw new Error("Internal Server Error")
        const deleteResJson = await deleteRes.json()
        if (!deleteRes.ok) throw new Error(deleteResJson.data)

        const pushRes = await fetch(`/api/deletedPosts/${postId}`, {
            method: "POST",
            body: JSON.stringify(post)
        })

        if (!pushRes) throw new Error("Internal Server Error")
        const pushResJson = await pushRes.json()

        if (!pushRes.ok) throw new Error(pushResJson.data)
    }
    catch (e: Error | any) {
        console.error(e)
        return { success: false, error: e }
    }
}
