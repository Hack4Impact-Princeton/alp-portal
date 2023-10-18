import Grid2 from "@mui/material/Unstable_Grid2";
import { Posts } from "../../models/Post";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Link } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
type PostProps = {
  post: Posts;
};
const PostContainer: React.FC<{}> = () => {
  return (
    <Grid2
      container
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#F5F5F5" }}
    >
      <Grid2
        container
        display="flex"
        flexDirection={"column"}
        sx={{ padding: 1 }}
      >
        <Grid2
          container
          display="flex"
          sx={{ position: "relative", height: "10vh" }}
        >
          <Grid2
            xs={2}
            container
            display="flex"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <AccountCircleIcon sx={{ fontSize: "4vw" }} />
          </Grid2>
          <Grid2
            container
            xs={9}
            display="flex"
            flexDirection={"column"}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            <h2>john doe</h2>
            <p style={{ fontStyle: "italic" }}>2 days ago</p>
          </Grid2>
          <Grid2 container xs={1}>
            <MoreVertIcon sx={{ position: "absolute", top: 0, right: 0 }} />
          </Grid2>
        </Grid2>
        <Grid2
          sx={{
            backgroundColor: "white",
            margin: 2,
            padding: 2,
          }}
        >
          <p style={{ lineHeight: 1.5 }}>
            I wanted to share some thoughts with my friends. What do you think
            of them? let me know your thoughts below.
          </p>
        </Grid2>
      </Grid2>
      <Grid2
        container
        display="flex"
        sx={{ backgroundColor: "white", margin: 0.5 }}
      >
        <Button>
          <FavoriteBorderIcon />
        </Button>
        <Button>
          <CommentIcon />
        </Button>
        <Button>{"View all comments"}</Button>
      </Grid2>
    </Grid2>
  );
};

export default PostContainer;
