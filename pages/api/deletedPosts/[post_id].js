import dbConnect from '../../../lib/dbConnect'
import { getDeletedPostModel } from '../../../models/Post'

export default async function handler(req, res) {
  const {
    query: { post_id },
    method,
  } = req

  await dbConnect()
  const Post = getDeletedPostModel()
  switch (method) {
    case 'POST': /* Create new Post */
        try {
          if (await Post.exists({post_id : post_id})) {
              console.log("deleted post already exists")
              return res.status(400).json({ success: false })
          }
          const parsedData = JSON.parse(req.body);
          if (post_id != parsedData.post_id){
            console.log("api post_id and post_id do not match")
            return res.status(400).json({ success: false })
          }
          const newPost = new Post(parsedData);
          if (!newPost)
            return res.status(400).json({ success: false })
          newPost.save(function (err, post) {
            if (err) return console.error(err);
            console.log(post.post_id + " saved to deleted post collection.");
          });
          res.status(200).json({ success: true, data: newPost })
        } catch (error) {
          console.log(error)
          res.status(400).json({ success: false })
        }
        break
    default:
      res.status(400).json({ success: false })
      break
  }
}
