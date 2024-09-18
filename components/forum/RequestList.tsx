import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import RequestPreview from "./RequestPreview";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { getStates } from "../../lib/enums";


// ... (previous imports)

type RequestListProps = {
  friendRequests: string[];
  myEmail: string;
  allVolunteers: VolunteerAccount[];
};

interface FriendInfo {
  pfp: string;
  email: string;
  fname: string;
  lname: string;
  state: { name: string; index: number };
}

const Overlay: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 2, // Set higher zIndex to appear above the overlay
    }}
    onClick={(e) => {
      e.stopPropagation(); // Prevent click propagation to underlying elements
      onClick();
    }}
  />
);

const RequestList: React.FC<RequestListProps> = ({
  friendRequests,
  myEmail,
  allVolunteers,
}) => {
  const reqEmailSet = new Set(friendRequests);
  const states = getStates();

  const friendInfo: VolunteerAccount[] = allVolunteers
    .map((account) =>
      reqEmailSet.has(account.email)
        ? account
        : null
    )
    .filter((item) => item !== null) as VolunteerAccount[];

  const [friendInfoList, setFriendInfoList] =
    useState<VolunteerAccount[]>(friendInfo);

  const [selectedFriendRequest, setSelectedFriendRequest] =
    useState<string | null>(null);

  const updateFriendReqs = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email !== friendReqEmail)
      );
      setSelectedFriendRequest(null); // Reset selected friend request
    }, 200);
  };

  return (
    <>
      <Grid2 style={{ backgroundColor: "#F5F5F5", height: "450px", overflow: 'auto' }}>
        {reqEmailSet.size === 0 && 
        <Grid2 sx={{p:2}}><p>No friend requests yet!</p></Grid2>
        }
        {friendInfoList &&
          friendInfoList.map((user) =>
            user ? (
              <div
                style={{
                  position: "relative",
                  zIndex: selectedFriendRequest === user.email ? 1 : 0,
                }}
              >
                {selectedFriendRequest === user.email && (
                  <Overlay onClick={() => setSelectedFriendRequest(null)} />
                )}
                <RequestPreview
                  reqAccount = {user}
                  myEmail={myEmail}
                  updateFunction={updateFriendReqs}
                  request={true}
                />
              </div>
            ) : null
          )}
      </Grid2>
    </>
  );
};

export default RequestList;
