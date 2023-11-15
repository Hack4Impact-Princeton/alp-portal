import React, { useState } from "react";
import {
  Switch,
  FormGroup,
  FormControlLabel,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Fab,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Posts } from "../../models/Post";
import genUniqueId from "../../lib/idGen";
import { format } from "date-fns";
import { BuildTwoTone } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "#F5F5F5",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
type NewPostProps = {
  username: string;
  email: string;
  addPost: (newPost: Posts) => void;
};

const NewPost: React.FC<NewPostProps> = ({ username, email, addPost }) => {
  const [open, setOpen] = useState(false);
  const [switchLabel, setSwitchLabel] = useState("Friends Only");
  const handleOpen = () => setOpen(true);
  const handleClose = () =>
    setTimeout(() => {
      setOpen(false);
    }, 200);
  const [submit, setSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const sendPost = async () => {
    try {
      setSubmit(true);
      setTimeout(() => {
        setSubmit(false);
      }, 4000);
      const newPost: Posts = {
        title: "",
        post_id: genUniqueId(),
        username: username,
        email: email,
        date: Intl.DateTimeFormat("sv-SE").format(new Date()).toString(),
        text: message,
        upvotes: [],
        downvotes: [],
        comments: [],
      };
      const res = await fetch(`/api/posts/${newPost.post_id}`, {
        method: "POST",
        body: JSON.stringify(newPost),
      });
      if (!res) throw new Error("Internal server error");
      const resJson = await res.json();
      if (res.status !== 200) throw new Error(resJson.data);
      console.log("successfully posted", resJson.data);
      addPost(resJson.data);
    } catch (e: Error | any) {
      console.error("Error posting", e);
      return { success: false, error: e };
    }
  };
  const onPostClick = () => {
    sendPost();
    handleClose();
    console.log("pressed");
  };

  return (
    <Grid2>
      <IconButton onClick={handleOpen} size="small">
        <AddCircleIcon fontSize="large" style={{ color: "#FE9834" }} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-post-modal"
        aria-describedby="new-post-modal"
      >
        <Grid2 sx={style}>
          <Grid2
            container
            display="flex"
            sx={{ position: "relative", height: "10vh" }}
          >
            <Grid2
              xs={3}
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
              xs={8}
              display="flex"
              flexDirection={"column"}
              sx={{
                height: "100%",
                justifyContent: "center",
                marginLeft: 2,
              }}
            >
              <h2>{username}</h2>
            </Grid2>
            <Grid2 container xs={1}>
              <IconButton
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Grid2>
          </Grid2>
          <Grid2
            container
            sx={{
              backgroundColor: "white",
              margin: 1,
              padding: 2,
              paddingTop: 1,
              marginBottom: 3,
            }}
            flexDirection={"column"}
          >
            <TextField
              required
              error={submit && message == ""}
              label="What do you want to talk about?"
              multiline
              rows={2}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
            />
            <Grid2 display="flex" flexDirection={"row"} sx={{ marginTop: 2 }}>
              <Button>
                <ImageOutlinedIcon />
              </Button>
              <Button>
                <UploadFileOutlinedIcon />
              </Button>
              <Button>
                <LinkOutlinedIcon />
              </Button>
            </Grid2>
          </Grid2>
          <Grid2 container flexDirection={"row"} alignItems={"center"}>
            <Grid2 xs={2}>
              <Switch defaultChecked color="warning" />
            </Grid2>
            <Grid2 xs={9}>
              <h4>{switchLabel}</h4>
            </Grid2>
            <Grid2 xs={1} sx={{ position: "absolute", right: 30 }}>
              <Button
                style={{ backgroundColor: "#F3D39A" }}
                onClick={onPostClick}
              >
                <h3 style={{ color: "black" }}>Post</h3>
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Modal>
    </Grid2>
  );
};

export default NewPost;
