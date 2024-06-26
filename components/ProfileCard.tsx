import React from "react";
import  { VolunteerAccount, BadgeType } from "../models/VolunteerAccount";
import {
  sendFriendRequest,
  approveFriendRequest,
  removeFriendRequest,
  removeFriend,
} from "../db_functions/friending";
//import {sendFriendRequest, approveFriendRequest, removeFriendRequest, removeFriend} from "../db_functions/friending"

type ProfileCardProps = {
  account: VolunteerAccount;
  name: string;
  state: string;
  email: string;
  profilePicture: string;
  affiliation: string;
  // badges: BadgeType;
  useBadges?: boolean;
  style?: React.CSSProperties;
  userEmail: string;
  receivedFriendRequestList: string[];
  sentFriendRequestList: string[];
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  account,
  name,
  state,
  email,
  profilePicture,
  affiliation,
  /*badges,*/ useBadges = true,
  style,
  userEmail,
  receivedFriendRequestList,
  sentFriendRequestList,
}) => {
  const [friendStatus, setFriendStatus] = React.useState<string>("none");
  console.log(userEmail + " is " + friendStatus + " with " + email);

  /*
  sent means userEmail sent a request to email and ema
  received means userEmail received a request from email
  friends means userEmail and email have each other in their friends array
  none means no relation at all
  */
  React.useEffect(() => {
    if (sentFriendRequestList.includes(email)) {
      setFriendStatus("sent");
    } else if (account.friends.includes(email)) {
      setFriendStatus("friends")
      setShowRevokeButton(true);
      //handleAcceptFriendRequest();
    } else if (receivedFriendRequestList.includes(email)) {
      // need to be that it has received so either accept or leave it there
      // also after accept, should do the revoke

      setFriendStatus("received");
      setShowRevokeButton(true);
      //handleReceiveFriendRequest();
    }
  }, [receivedFriendRequestList, email]);

  const [showRevokeButton, setShowRevokeButton] =
    React.useState<boolean>(false);

  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#f2f2f2",
    overflowWrap: "break-word",
    ...style, // Add the provided style
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    maxWidth: "100%",
  };

  const imageStyle: React.CSSProperties = {
    width: "100px",
    height: "auto",
    marginBottom: "10px",
  };

  const badgesContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
  };

  const userInfoStyle: React.CSSProperties = {
    marginLeft: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop:"5px",
    maxHeight: "60px", // Set a maximum height for the email container
    //overflow: 'hidden',
    overflowWrap: "break-word",
    wordWrap: "break-word",
    maxWidth: "100%",
  };

  const userInfoItemStyle: React.CSSProperties = {
    marginBottom: "5px",
    textOverflow: "ellipsis", 
    overflowWrap: "break-word",
    wordWrap: "break-word",
    maxWidth: "100%",
   
  };

  const badgesAndButtonsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column", // Stack badges and buttons in a column
    marginLeft: "10px", // Add margin to separate user information and badges/buttons
  };
  const buttonsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop:2,
  };

  const getButtonColor = () => {
    switch (friendStatus) {
      case "none":
        return "#FE9834";
      case "sent":
        return "#5F5F5F";
      case "received":
        return "#008000";
      case "friends":
        return "#FF7629";
      default:
        return "#FE9834";
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 110px",
    borderRadius: "4px",
   // border: "none",
    borderColor: "#5F5F5F",
    backgroundColor: getButtonColor(),
    color: "white",
    cursor: "pointer",
    margin: "4px 0",
  };

  const revokeButtonStyle: React.CSSProperties = {
    padding: "8px 80px", // check this
    borderRadius: "4px",
     backgroundColor: getButtonColor(),
    color: "white",
    border:"none",
    cursor: "pointer",
    margin: "4px 0",
  };

  const handleSendFriendRequest = (userEmail: string, email: string) => {
    console.log("in handleSendFriendRequest");
    setFriendStatus("sent");
    sendFriendRequest(userEmail, email); // the way the function is written in friending.ts has the order reversed so
    setShowRevokeButton(true);
  };

  const handleRevokeFriendRequest = (userEmail:string, email: string) => {
    setFriendStatus("none");
    removeFriendRequest(email, userEmail);
    // insert some revokeFriendRequest function here (import from friending.ts)
  };

  const handleRemoveFriends = (userEmail: string, email: string) => {
    setFriendStatus("none");
    removeFriend(userEmail, email);
  };
  
  const handleAcceptFriendRequest = (userEmail: string, email: string) => {
    setFriendStatus("friends");
    approveFriendRequest(userEmail, email);
    setShowRevokeButton(true);
  };

  return (
    <div style={cardStyle}>
      <div style={contentStyle}>
        <img src={profilePicture} alt="Profile" style={imageStyle} />
        <div style={userInfoStyle}>
          <p style={{...userInfoItemStyle, fontWeight:"bold"}}>{name}</p>
          <p style={userInfoItemStyle}>{state}</p>
          <p style={{...userInfoItemStyle, fontStyle:"italic"}}>{affiliation}</p>
        </div>
      </div>

      <div style={buttonsContainerStyle}>
        {friendStatus === "none" && (
          <div>
            <button
              onClick={() => {
                handleSendFriendRequest(userEmail, email);
              }}
              style={buttonStyle}
            >
              Request
            </button>
          </div>
        )}
        {friendStatus === "sent" && (
          <button
            style={revokeButtonStyle}
            onClick={() => {
              handleRevokeFriendRequest(userEmail, email);
              setFriendStatus("none");
            }}
          >
            Cancel Request
          </button>
        )}
        {(/*friendStatus === "received" ||*/ friendStatus === "friends") &&
          showRevokeButton && (
            <button style={revokeButtonStyle} onClick={()=> handleRemoveFriends(userEmail, email)}>
              Remove Friend
            </button>
          )}
        {friendStatus === "received" && (
          <button style={buttonStyle} onClick={() => handleAcceptFriendRequest(userEmail, email)}>
            Accept
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
