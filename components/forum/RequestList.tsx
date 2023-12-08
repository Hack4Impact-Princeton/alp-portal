import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import RequestPreview from "./RequestPreview";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { getStates } from "../../lib/enums";

type RequestListProps = {
  friendRequests: string[];
  myEmail: string;
  allAccounts: VolunteerAccount[];
};

interface FriendInfo {
  email: string;
  fname: string;
  lname: string;
  state: { name: string; index: number };
  // Add or modify properties as needed
}

const RequestList: React.FC<RequestListProps> = ({
  friendRequests,
  myEmail,
  allAccounts,
}) => {
  const reqEmailSet = new Set(friendRequests);
  const states = getStates();

  const friendInfo: FriendInfo[] = allAccounts
    .map((account) =>
      reqEmailSet.has(account.email)
        ? {
            email: account.email,
            fname: account.fname,
            lname: account.lname[0],
            state: states.find((state) => state.index === account.location),
            // Add or modify properties as needed
          }
        : null
    )
    .filter((item) => item !== null) as FriendInfo[];

  const [friendInfoList, setFriendInfoList] =
    useState<FriendInfo[]>(friendInfo);

  const updateFriendReqs = (friendReq: FriendInfo) => {};

  return (
    <>
      <Grid2>
        <h3>beginning of friend requests</h3>
        {friendInfoList &&
          friendInfoList.map((user) =>
            user ? (
              <RequestPreview
                fname={user.fname}
                lname={user.lname}
                state={user.state ? user.state.name : ""}
                myEmail={myEmail}
                reqEmail={user.email}
              />
            ) : null
          )}
      </Grid2>
    </>
  );
};

/*          */
export default RequestList;
