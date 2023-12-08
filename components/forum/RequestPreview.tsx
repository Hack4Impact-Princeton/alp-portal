import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import approveFriendRequest from "../../db_functions/friending";

type ReqProps = {
  fname: string;
  lname: string;
  state: string;
  myEmail: string;
  reqEmail: string;
};

const RequestPreview: React.FC<ReqProps> = ({
  fname,
  lname,
  state,
  myEmail,
  reqEmail,
}) => {
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
        sx={{ height: "100%", justifyContent: "center" }}
      >
        <h3>
          {fname} {lname}.
        </h3>
        <p>{state}</p>
      </Grid2>
      <Grid2 display="flex" sx={{ height: "100%", justifyContent: "center" }}>
        <Grid2>
          <IconButton onClick={() => approveFriendRequest(myEmail, reqEmail)}>
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
