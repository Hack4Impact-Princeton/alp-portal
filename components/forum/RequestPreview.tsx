import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

type ReqProps = {
  name: string;
  state: string;
};

const RequestPreview: React.FC<{}> = () => {
  return (
    <Grid2
      display="flex"
      sx={{
        backgroundColor: "#F5F5F5",
        height: "12vh",
        padding: 1,
      }}
      container
      justifyContent={"space-between"}
      alignContent={"center"}
    >
      <Grid2
        display="flex"
        sx={{ height: "100%", justifyContent: "center", pl: "3%" }}
      >
        <AccountCircleIcon sx={{ fontSize: "4vw" }} />
      </Grid2>
      <Grid2
        display="flex"
        flexDirection="column"
        sx={{ height: "100%", justifyContent: "center", pr: "30%" }}
      >
        <h3>name</h3>
        <p>State</p>
      </Grid2>
      <Grid2 display="flex" sx={{ height: "100%", justifyContent: "center" }}>
        <Grid2>
          <IconButton>
            <DoneIcon />
          </IconButton>
        </Grid2>
        <Grid2>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default RequestPreview;
