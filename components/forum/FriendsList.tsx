import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import RequestPreview from "./RequestPreview";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { getStates } from "../../lib/enums";

type RequestListProps = {
  myFriends: string[];
  myEmail: string;
  allVolunteers: VolunteerAccount[];
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
}) => {
  //console.log("volunteers ", allVolunteers);
  const myFriendSet = new Set(myFriends);
  const states = getStates();

  const friendInfo: FriendInfo[] = allVolunteers
    .map((account) =>
      myFriendSet.has(account.email)
        ? {
            email: account.email,
            fname: account.fname,
            lname: account.lname[0],
            state : { name: states.find((state) => state.index === account.state)?.name || "", index: account.state },
            // state: states.find((state) => state.index === account.location),
            // Add or modify properties as needed
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
      <Grid2 style={{ backgroundColor: "#F5F5F5", height: "450px", overflow:"auto" }}>
        {myFriendSet.size === 0 && <Grid2 sx={{p:2}}><p>Add some friends!</p></Grid2>}
        {friendInfoList &&
          friendInfoList.map((user) =>
            user ? (
              <RequestPreview
                fname={user.fname}
                lname={user.lname}
                state={user.state ? user.state.name : ""}
                myEmail={myEmail}
                reqEmail={user.email}
                updateFunction={() => {}}
                request={false}
              />
            ) : null
          )}
      </Grid2>
    </>
  );
};

/*          */
export default RequestList;
