import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import RequestPreview from "./RequestPreview";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { getStates } from "../../lib/enums";

type RequestListProps = {
  myFriends: string[];
  myEmail: string;
  allVolunteers: VolunteerAccount[];
  myAccount: VolunteerAccount;
};

interface FriendInfo {
  pfp:  string;
  email: string;
  fname: string;
  lname: string;
  state: { name: string; index: number };

  // Add or modify properties as needed
}

const RequestList: React.FC<RequestListProps> = ({
  myFriends,
  myEmail,
  allVolunteers,
  myAccount
}) => {
  //console.log("volunteers ", allVolunteers);
  const myFriendSet = new Set(myFriends);
  const states = getStates();

  const friendInfo: VolunteerAccount[] = allVolunteers
    .map((account) =>
      myFriendSet.has(account.email)
        ? 
            
          account
            
        : null
    )
    .filter((item) => item !== null) as VolunteerAccount[];

  const [friendInfoList, setFriendInfoList] =
    useState<VolunteerAccount[]>(friendInfo);

  const updateFriendReqs = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email != friendReqEmail)
      );
    }, 200);
  };

  return (
    <>
      <Grid2 style={{ backgroundColor: "#F5F5F5", height: "450px", overflow:"auto" }}>
        {myFriendSet.size === 0 && <Grid2 sx={{p:2}}><p>Add some friends!</p></Grid2>}
        {friendInfoList &&
          friendInfoList.map((user) =>
            user ? (
              <RequestPreview
                fname={user.fname}
                lname={user.lname}
                state={""}
                myEmail={myEmail}
                reqEmail={user.email}
                updateFunction={() => {}}
                request={false}
                pfp={user.pfpLink}
                myAccount={myAccount}
                friendAccount={user}
              />
            ) : null
          )}
      </Grid2>
    </>
  );
};

/*          */
export default RequestList;
