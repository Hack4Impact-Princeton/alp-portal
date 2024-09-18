import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton,Button } from "@mui/material";
import approveFriendRequest, {
  removeFriendRequest,
} from "../../db_functions/friending";
import FriendRequestCard from "../FriendRequestCard";
import MessageIcon from '@mui/icons-material/Message';
import VisibilityIcon from '@mui/icons-material/Visibility';
import createChat from "../../db_functions/chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import Link from 'next/link';

type ReqProps = {
  reqAccount: VolunteerAccount;
  myEmail: string;
  updateFunction: (friendReqEmail: string) => void;
  request: boolean;
  myAccount?: VolunteerAccount;
  friendAccount?: VolunteerAccount
  
};

const RequestPreview: React.FC<ReqProps> = ({
  reqAccount,
  myEmail,
  updateFunction,
  request,
  myAccount,
  friendAccount
  
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
        
        <>
        <Grid
          xs={2.5}
          display="flex"
          sx={{ height: "100%", justifyContent: "center" }}
        >
          {/* Step 3: Make the name clickable */}
          <span
            style={{ cursor: "pointer" , display:"flex", alignItems:"center"}}
            onClick={() => {setShowFriendRequestCard(!showFriendRequestCard)}}
          >
            <img src={reqAccount.pfpLink} alt="PFP" style={{borderRadius:'50%',width:"85%"}} />
          </span>
        </Grid>
        <Grid
          xs={5.5}
          display="flex"
          flexDirection="column"
          sx={{ height: "100%", justifyContent: "center",textOverflow:'wrap',pr:2 }}
        >
          <h3 style={{wordWrap: 'break-word'}}>
            {reqAccount.fname} {reqAccount.lname ? reqAccount.lname[0] : ""}.
          </h3>
          <p>{reqAccount.state}</p>
        </Grid></>  
        {!request && myAccount && friendAccount && (
          <Grid xs={4} container alignContent={"center"}>
            <Grid xs={7} display={"flex"} justifyContent={"center"} >
              <IconButton
                sx={{ backgroundColor: "#5F5F5F", color: "#FFFFFF",borderRadius:"30px",pl:2,pr:2, width:"80%"}}
                size={"small"}
                onClick={() => {
                }}
              >
                <Link href={`/friendprofile?data=${encodeURIComponent(JSON.stringify(friendAccount._id))}`}>
                    <p style={{fontSize:"1vw"}} >view</p>
                </Link>
                {/*<VisibilityIcon />*/}
              </IconButton>
            </Grid>
            <Grid xs={5} display={"flex"} justifyContent={"center"}>
              <IconButton
                sx={{ backgroundColor: "#5F5F5F", color: "#FFFFFF" }}
                size={"small"}
                onClick={() => {
                  createChat(friendAccount.email,myAccount);
                  console.log(friendAccount.email,myAccount.email)
                }}
              >
                <MessageIcon />
              </IconButton>
            </Grid>
            </Grid>
        )}
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
                  profilePicture={reqAccount.pfpLink}
                  name={`${reqAccount.fname} ${reqAccount.lname ?reqAccount.lname[0]+"." : ""}`}
                  affiliation={reqAccount.affiliation}
                  reqEmail={reqAccount.email}
                  state={reqAccount.state}
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
                  approveFriendRequest(myEmail, reqAccount.email);
                  updateFunction(reqAccount.email);
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
                  removeFriendRequest(myEmail, reqAccount.email);
                  updateFunction(reqAccount.email);
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
