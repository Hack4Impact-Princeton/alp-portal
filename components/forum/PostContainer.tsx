import Grid2 from "@mui/material/Unstable_Grid2";
import { Posts, Comments } from "../../models/Post";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Link, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { useState, useRef, useEffect } from 'react'

import { nanoid } from 'nanoid'
import autoAnimate from '@formkit/auto-animate'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

type PostProps = {
  post: Posts;
};


const genRandomDate = () => {
  const emptyDate = new Date();
  const randomDate = new Date();
  const dateFormatter = Intl.DateTimeFormat('sv-SE');
  const formattedRandomDate = dateFormatter.format(emptyDate.setDate(randomDate.getDate() - Math.floor(Math.random()*365)));
  return formattedRandomDate;
}

const GEN_DUMMY_COMMENTS = (n: number) => {
  let comments: Comments[] = [];
  for (let i = 0; i < n; i++) {
    comments.push({
      email: "email@string.domain",
      date: genRandomDate(),
      text: `
      something very insightul.
      `,
      upvotes: 0,
      downvotes: 0,
      comment_id: nanoid(),
      username: nanoid(4),
    });
  }
  return comments;
}

const PostContainer: React.FC<PostProps> = ({ post }) => {

  const [showComments, setShowComments] = useState(false);
  const parent = useRef(null)

  useEffect(() => {
    post.comments = GEN_DUMMY_COMMENTS(4);
  }, []);

  const handleViewComments = () => {
    setShowComments(!showComments);
  }

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const formatDate = (d: string) => {
    const NATURAL_FORMATTING_DISTANCE = 30*6 // 6 months
    const date = Date.parse(d);

    const diff = Math.floor((new Date().getTime() - date) / (24*60*60*1000))

    if (diff <= NATURAL_FORMATTING_DISTANCE) {
      return formatDistance(date, new Date(), { addSuffix: true })
    } else {
      return format(date, 'MMMM do, yyyy');
    }
  }

  return (
    <Grid2
      container
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#F5F5F5" }}
      style={{ width: "100%" }}
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
            <h2>{post.email}</h2>
            <p style={{ fontStyle: "italic" }}>{post.date}</p>
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
          <p style={{ lineHeight: 1.5 }}>{post.text}</p>
        </Grid2>
      </Grid2>
      <Grid2
        container
        display="flex"
        sx={{ backgroundColor: "white", margin: 0.5 }}
        //style={{ width: "100%" }}
      >
        <div
          style={{ width: "100%" }}
        >
          <div ref={parent}
            style={{ width: "100%" }}
          >
            <div>
              <IconButton>
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton>
                <CommentIcon />
              </IconButton>
              <Button
                onClick={handleViewComments}
                style={{
                  color: "gray",
                  fontStyle: "italic",
                  textTransform: "none",
                  textDecoration: "underline",
                  textDecorationColor: "lightgray",
                }}
              >
                {`${showComments? "Hide" : "View"} all comments`}
              </Button>
            </div>
            {showComments && post.comments.map((comment) => {
              return (
                <div
                  key={comment.comment_id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "1rem",
                  }}
                >

                    <AccountCircleIcon sx={{ fontSize: "4vw" }}
                      style={{
                        color: "#848484", // TODO
                      }}
                    />

                  <div
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderRadius: "2px",
                      width: "100%",
                    }}
                  >
                    <Grid2
                      container
                      display="flex"
                      flexDirection="row"
                      sx={{
                        position: "relative",
                      }}
                      paddingX="1rem"
                      paddingTop="1rem"
                    >
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
                        <h2
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "#4E4C4C", // TODO
                          }}
                        >{comment.username}</h2>
                        <p style={{
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                          color: "#848484", // TODO
                          marginTop: "6px",
                          }}>{
                          formatDate(comment.date)
                        }</p>
                      </Grid2>
                    </Grid2>
                    <Grid2
                      sx={{
                        padding: 2,
                      }}
                      minWidth="100%"
                    >
                      <p style={{ lineHeight: 1.5 }}>{comment.text}</p>
                    </Grid2>
                  </div>

                </div>
              );
            })}
          </div>
          </div>
      </Grid2>
    </Grid2>
  );
};

export default PostContainer;
