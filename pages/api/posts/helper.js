
async function createPost(alp_id, title, text){
    const data = {
        title: {type: String},
        post_id: {type: Number},
        alp_id: {type: String},
        date: {},
        text: text,
        upvotes: [],
        downvotes: [],
        comments: []
    }
    const res = await fetch('../api/posts/' + alp_id, {
        method: "POST",
        body: JSON.stringify(data),
    })

}


async function upvotePost(alp_id, post_id) {
    const res = await fetch('../api/posts/' + alp_id, {
        method: "GET",
    })
    let data = res.body;
    if (alp_id in data.upvotes) return;
    if (alp_id in data.downvotes) 
        data.splice(data.indexOf(alp_id));
    data.upvotes.push(alp_id);
    await fetch('../api/posts/' + alp_id, {
        method: "PUT",
        body: JSON.stringify(data)
    })
}
