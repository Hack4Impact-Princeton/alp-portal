import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import approveFriendRequest, {
  removeFriendRequest,
} from "../../db_functions/friending";

type ReqProps = {
  fname: string;
  lname: string;
  state: string;
  myEmail: string;
  reqEmail: string;
  updateFunction: (friendReqEmail: string) => void;
  request: boolean;
};

const RequestPreview: React.FC<ReqProps> = ({
  fname,
  lname,
  state,
  myEmail,
  reqEmail,
  updateFunction,
  request,
}) => {
  return (
    <div style={{ borderColor: "black", borderWidth: 4, borderRadius: 1 }}>
      <Grid
        display="flex"
        sx={{
          backgroundColor: "#F5F5F5",
          height: "12vh",
          padding: 1,
        }}
        container
       
        alignContent={"center"}
      >
        <Grid
          xs={3}
          display="flex"
          sx={{ height: "100%", justifyContent: "center"}}
        >
          <AccountCircleIcon sx={{ fontSize: "4vw" }} />
        </Grid>
        <Grid
          xs={5}
          display="flex"
          flexDirection="column"
          sx={{ height: "100%", justifyContent: "center"}}
        >
          <h3>
            {fname} {lname}.
          </h3>
          <p>{state}</p>
        </Grid>
        {request && (
          <Grid
            xs={4}
            display="flex"
            sx={{ height: "100%", justifyContent: "center",alignItems:"center" }}
          >
            <Grid xs={6} display={'flex'} justifyContent={'center'}>
              <IconButton sx={{backgroundColor:"#5F5F5F", color:"#FFFFFF"}} size={"small"}
                onClick={() => {
                  approveFriendRequest(myEmail, reqEmail);
                  updateFunction(reqEmail);
                }}
              >
                <DoneIcon />
              </IconButton>
            </Grid>
            <Grid xs={4} display ={'flex'} justifyContent={'center'}>
              <IconButton sx={{backgroundColor:"#5F5F5F", color:"#FFFFFF"}} size={"small"}
                onClick={() => {
                  removeFriendRequest(myEmail, reqEmail);
                  updateFunction(reqEmail);
                }}
              >
                <CloseIcon
                  
                />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default RequestPreview;
