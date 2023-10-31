import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

const NewPost: React.FC<{}> = ({}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-post-modal"
      aria-describedby="new-post-modal"
    >
      <Grid2>
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
          </Grid2>
          <Grid2 container xs={1}>
            <CloseIcon sx={{ position: "absolute", top: 0, right: 0 }} />
          </Grid2>
        </Grid2>
        <Grid2>
          <TextField
            label="What do you want to talk about?"
            multiline
            rows={2}
            variant="standard"
          />
          <Grid2 display="flex" flexDirection={"row"}>
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
      </Grid2>
    </Modal>
  );
};
export default NewPost;
