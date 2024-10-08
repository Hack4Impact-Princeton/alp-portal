import React, { useState, useEffect } from "react";
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
import {updateConnector} from "../../db_functions/badges"

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

import RichEditor from './RichEditor'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}



//import { Editor } from 'slate-react'
//import InsertImages from 'slate-drop-or-paste-images'

//const plugins = [
//  InsertImages({
//    extensions: ['png'],
//    insertImage: (change, file) => {
//      return change.insertBlock({
//        type: 'image',
//        isVoid: true,
//        data: { file }
//      })
//    }
//  })
//]


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "#F5F5F5",
  border: "2px solid #5F5F5F",
  boxShadow: 24,
  p: 4,
};
type NewPostProps = {
  username: string;
  pfpLink: string;
  email: string;
  addPost: (newPost: Posts) => void;
};

const NewPost: React.FC<NewPostProps> = ({ pfpLink,username, email, addPost }) => {
  const [open, setOpen] = useState(false);
  const [switchLabel, setSwitchLabel] = useState("Public");
  const handleOpen = () => setOpen(true);
  const handleClose = () =>
    setTimeout(() => {
      setOpen(false);
      setMessage("");
    }, 200);

  const [submit, setSubmit] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(switchLabel);
  }, [switchLabel]);

  const sendPost = async () => {
    try {
      setSubmit(true);
      setTimeout(() => {
        setSubmit(false);
      }, 4000); // uh, why are we waiting 4s here?
      console.log(pfpLink)
      const newPost: Posts = {
        title: "",
        post_id: genUniqueId(),
        pfpLink: pfpLink,
        username: username,
        email: email,
        date: Intl.DateTimeFormat("sv-SE").format(new Date()).toString(),
        text: message,
        upvotes: [],
        downvotes: [],
        comments: [],
        is_public: (switchLabel === "Public"),
        flagged: false,
        flagMessage:"",
        flaggerEmail:"",
 
      };
      console.log(newPost)
      const res = await fetch(`/api/posts/${newPost.post_id}`, {
        method: "POST",
        body: JSON.stringify(newPost),
      });
      console.log(JSON.stringify(newPost))
      setSwitchLabel("Public");

      if (!res) throw new Error("Internal server error");
      const resJson = await res.json();
      if (res.status !== 200) throw new Error(resJson.data);
      console.log("successfully posted", resJson.data);
      addPost(resJson.data);
      updateConnector(email, newPost.post_id)
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


  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    },
  ]

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
              <img src={pfpLink} style={{height: "4vw",borderRadius:'50%' }} />
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


            {/*<TextField
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
            />*/}

            <RichEditor
              onChange={setMessage}
              readOnly={false}
              initialValue={initialValue}
              post_id={""}
            />

          </Grid2>
          <Grid2 container flexDirection={"row"} alignItems={"center"}>
            <Grid2 xs={2}>
              <Switch defaultChecked color="warning"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.checked
                    ? setSwitchLabel("Public")
                    : setSwitchLabel("Friends Only")
                }
              />
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












