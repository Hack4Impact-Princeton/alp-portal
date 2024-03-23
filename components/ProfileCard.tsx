import React from "react";
import { BadgeType } from "../models/VolunteerAccount";
import sendFriendRequest from "../db_functions/friending";
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
      handleAcceptFriendRequest();
    } else if (receivedFriendRequestList.includes(email)) {
      // need to be that it has received so either accept or leave it there
      // also after accept, should do the revoke
      handleReceiveFriendRequest();
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
    maxHeight: "60px", // Set a maximum height for the email container
    //overflow: 'hidden',
    overflowWrap: "break-word",
    wordWrap: "break-word",
    maxWidth: "100%",
  };

  const userInfoItemStyle: React.CSSProperties = {
    marginBottom: "5px",
    textOverflow: "ellipsis", // Add ellipsis for overflowed text
    overflowWrap: "break-word",
    wordWrap: "break-word",
    maxWidth: "100%",

    //whiteSpace: 'nowrap', // Prevent text from wrapping
    //overflow: 'hidden',
  };

  const badgesAndButtonsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column", // Stack badges and buttons in a column
    marginLeft: "10px", // Add margin to separate user information and badges/buttons
  };
  const buttonsContainerStyle: React.CSSProperties = {
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
  };

  const getButtonColor = () => {
    switch (friendStatus) {
      case "none":
        return "#FE9834";
      case "sent":
        return "#FF5733";
      case "received":
        return "#800080";
      case "friends":
        return "#4CAF50";
      default:
        return "#FE9834";
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: getButtonColor(),
    color: "white",
    cursor: "pointer",
    margin: "4px 0",
  };

  const revokeButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#A9A9A9",
    color: "white",
    cursor: "pointer",
    margin: "4px 0",
  };

  const handleSendFriendRequest = (firstEmail, secEmail) => {
    console.log("in handleSendFriendRequest");
    setFriendStatus("sent");
    //sendFriendRequest(firstEmail, secEmail);
    // setShowRevokeButton(true);
  };

  const handleRevokeFriendRequest = () => {
    setFriendStatus("none");
  };

  const handleAcceptFriendRequest = () => {
    setFriendStatus("friends");
    setShowRevokeButton(true);
  };

  const handleReceiveFriendRequest = () => {
    setFriendStatus("received");
    // setShowRevokeButton(true);
  };

  return (
    <div style={cardStyle}>
      <div style={contentStyle}>
        <img src={profilePicture} alt="Profile" style={imageStyle} />
        <div style={userInfoStyle}>
          <p style={userInfoItemStyle}>{name}</p>
          <p style={userInfoItemStyle}>{state}</p>
          <p style={userInfoItemStyle}>{affiliation}</p>
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
              Send Friend Request
            </button>
          </div>
        )}
        {friendStatus === "sent" && (
          <button
            style={buttonStyle}
            onClick={() => {
              handleRevokeFriendRequest();
              setFriendStatus("none");
            }}
          >
            Click Here to Revoke
          </button>
        )}
        {(friendStatus === "received" || friendStatus === "friends") &&
          showRevokeButton && (
            <button style={buttonStyle} onClick={handleRevokeFriendRequest}>
              Unfriend
            </button>
          )}
        {friendStatus === "received" && (
          <button style={buttonStyle} onClick={handleAcceptFriendRequest}>
            Accept Friend Request
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
