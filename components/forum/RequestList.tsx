import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import RequestPreview from "./RequestPreview";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { getStates } from "../../lib/enums";
import { ChildFriendly } from "@mui/icons-material";


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

  // Add or modify properties as needed
}

const RequestList: React.FC<RequestListProps> = ({
  friendRequests,
  myEmail,
  allVolunteers,
}) => {
  //console.log("volunteers ", allVolunteers);
  const reqEmailSet = new Set(friendRequests);
  const states = getStates();

  const friendInfo: FriendInfo[] = allVolunteers
    .map((account) =>
      reqEmailSet.has(account.email)
        ? {
            pfp: account.pfpLink,
            email: account.email,
            fname: account.fname,
            lname: account.lname[0],
            state: states.find((state) => state.index === account.location),
          }
        : null
    )
    .filter((item) => item !== null) as FriendInfo[];

  const [friendInfoList, setFriendInfoList] =
    useState<FriendInfo[]>(friendInfo);

  const updateFriendReqs = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email != friendReqEmail)
      );
    }, 200);
  };

  return (
    <>
      <Grid2 style={{ backgroundColor: "#F5F5F5", height: "450px",overflow: 'auto' }}>
        {reqEmailSet.size === 0 && 
        <Grid2 sx={{p:2}}><p>No friend requests yet!</p></Grid2>
        }
        {friendInfoList &&
          friendInfoList.map((user) =>
            user ? (
              <RequestPreview
                pfp={user.pfp}
                fname={user.fname}
                lname={user.lname}
                state={user.state ? user.state.name : ""}
                myEmail={myEmail}
                reqEmail={user.email}
                updateFunction={updateFriendReqs}
                request={true}
              />
            ) : null
          )}
      </Grid2>
    </>
  );
};

/*          */
export default RequestList;
