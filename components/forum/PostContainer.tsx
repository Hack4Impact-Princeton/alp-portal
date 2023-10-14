import Grid2 from "@mui/material/Unstable_Grid2";
import { Posts } from "../../models/Post";

type PostProps = {
  post: Posts;
};
const PostContainer: React.FC<PostProps> = ({ post }) => {
  return (
    <Grid2 container display="flex" flexDirection={"column"}>
      <Grid2 display="flex" flexDirection={"column"}></Grid2>
    </Grid2>
  );
};

export default PostContainer;
