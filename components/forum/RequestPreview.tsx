import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import approveFriendRequest, {
  removeFriendRequest,
} from "../../db_functions/friending";
import FriendRequestCard from "../FriendRequestCard";

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
  const [showFriendRequestCard, setShowFriendRequestCard] = useState(false);

  const closeFriendRequestCard = () => {
    setShowFriendRequestCard(false);
  };

  return (
    <div style={{ borderColor: "black", borderWidth: 4, borderRadius: 1 }}>
      <Grid
        display="flex"
        sx={{
          height: "12vh",
          padding: 1,
          position: "relative", // Set position to relative
        }}
        container
        alignContent={"center"}
      >
        {/* Translucent overlay for background */}
        {showFriendRequestCard && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value for the desired level of transparency
              zIndex: 2, // Set higher zIndex to appear above the overlay
            }}
            onClick={closeFriendRequestCard}
          />
        )}

        <Grid
          xs={3}
          display="flex"
          sx={{ height: "100%", justifyContent: "center" }}
        >
          {/* Step 3: Make the name clickable */}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowFriendRequestCard(!showFriendRequestCard)}
          >
            <AccountCircleIcon sx={{ fontSize: "4vw" }} />
          </span>
        </Grid>
        <Grid
          xs={5}
          display="flex"
          flexDirection="column"
          sx={{ height: "100%", justifyContent: "center" }}
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
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "relative", // Set position to relative
              zIndex: 3, // Set higher zIndex to appear above the overlay
            }}
          >
            {showFriendRequestCard && (
              <div
                style={{
                  position: "absolute",
                  top: "50%", // Adjust to move higher
                  right: 100,
                  zIndex: 4, // Set higher zIndex to appear above the overlay
                  width: "200%", // Adjust to make wider
                }}
              >
                <FriendRequestCard
                  profilePicture={""}
                  name={`${fname} ${lname}`}
                  reqEmail={reqEmail}
                  state={state}
                  myEmail={myEmail}
                  onApprove={(email) => {
                    approveFriendRequest(myEmail, email);
                    updateFunction(email);
                    setShowFriendRequestCard(false); // Hide the card after action completion
                  }}
                  onReject={(email) => {
                    removeFriendRequest(myEmail, email);
                    updateFunction(email);
                    setShowFriendRequestCard(false); // Hide the card after action completion
                  }}
                  onActionCompleted={(message) => {
                    console.log(message);
                  }}
                />
              </div>
            )}

            <Grid xs={6} display={"flex"} justifyContent={"center"}>
              <IconButton
                sx={{ backgroundColor: "#5F5F5F", color: "#FFFFFF" }}
                size={"small"}
                onClick={() => {
                  approveFriendRequest(myEmail, reqEmail);
                  updateFunction(reqEmail);
                }}
              >
                <DoneIcon />
              </IconButton>
            </Grid>
            <Grid xs={4} display={"flex"} justifyContent={"center"}>
              <IconButton
                sx={{ backgroundColor: "#5F5F5F", color: "#FFFFFF" }}
                size={"small"}
                onClick={() => {
                  removeFriendRequest(myEmail, reqEmail);
                  updateFunction(reqEmail);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default RequestPreview;
