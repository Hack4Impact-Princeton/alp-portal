import dbConnect from '../../../lib/dbConnect'
import getPostModel from '../../../models/Post'

export default async function handler(req, res) {
  const {
    query: { post_id },
    method,
  } = req

  await dbConnect()
  const Post = getPostModel();
  switch (method) {
    case 'GET' /* Get a model by its post_id */:
      try {
        const post = await Post.findOne({post_id : post_id}).exec();
        if (!post) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its post_id */:
      try {
        /* get post_id and update */
        const update = JSON.parse(req.body)
        const post = await Post.findOneAndUpdate({post_id : post_id}, update, { 
          new: true,
          runValidators: true,
        })
        console.log(req.body)
        console.log(post)
        if (!post) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST': /* Create new Drive */
        try {
          if (await Post.exists({post_id : post_id})) {
              console.log("post already exists")
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
            console.log(post.post_id + " saved to post collection.");
          });
          res.status(200).json({ success: true, data: newPost })
        } catch (error) {
          console.log(error)
          res.status(400).json({ success: false })
        }
        break
    case 'DELETE' /* Delete a model by its post_id */:
      try {
        const deletedPost = await Post.findOneAndDelete({post_id : post_id});
        if (!deletedPost) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
