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

const NewPost: React.FC<{}> = ({}) => {
  const [open, setOpen] = useState(false);
  const [switchLabel, setSwitchLabel] = useState("Friends Only");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
              <h2>name</h2>
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
              label="What do you want to talk about?"
              multiline
              rows={2}
              variant="standard"
              InputProps={{ disableUnderline: true }}
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
              <Button variant="contained" sx={{ backgroundColor: "#F3D39A" }}>
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
