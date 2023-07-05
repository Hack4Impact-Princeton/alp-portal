import * as PostHelper from "../pages/api/posts/postHelper.js"

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

// test creating post
const post0 = await PostHelper.createPost("id_1", "test post 0", "i really hope this works"); // make new post
// test adding new post 
const post1 = await PostHelper.createPost("id_2", "test post 1", "i really hope this works too"); // make new post
console.log(post0.post_id != post1.post_id)

// test upvotes
let res = await PostHelper.upvotePost("id_1", post0.post_id);
console.log(arrayEquals(["id_1"], res.upvotes))
res = await PostHelper.upvotePost("id_1", post0.post_id); // shouldn't generate a new upvote
console.log(arrayEquals(["id_1"], res.upvotes))

// test downvotes 
res = await PostHelper.downvotePost("id_2", post0.post_id);
console.log(arrayEquals(["id_2"], res.downvotes))
res = await PostHelper.downvotePost("id_2", post0.post_id); // shouldn't generate a new downvote
console.log(arrayEquals(["id_2"], res.downvotes))
res = await PostHelper.downvotePost("id_1", post0.post_id); // move id_1 to downvotes
console.log(arrayEquals(["id_2", "id_1"], res.downvotes) && arrayEquals([], res.upvotes))
res = await PostHelper.upvotePost("id_2", post0.post_id); // move id_2 to upvotes
console.log(arrayEquals(["id_1"], res.downvotes) && arrayEquals(["id_2"], res.upvotes))

// test delete
res = await PostHelper.deletePost(post0.post_id);
console.log(res);
res = await PostHelper.deletePost(post1.post_id);
console.log(res);

// test adding comments


