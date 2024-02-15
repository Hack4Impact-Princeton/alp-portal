import { ProfilerProps } from 'react';
import Navbar from '../components/Navbar';
import { NextPage } from 'next';
import useDynamicPadding from '../lib/useDynamicPadding';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Badge } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Popover, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import getVolunteerAccountModel, { VolunteerAccount } from "../models/VolunteerAccount";
import getBookDriveModel, { BookDrive } from "../models/BookDrive";
import { Button, styled } from '@mui/material';
import Link from 'next/link';
import { Grid } from "@mui/material";
import Box from '@mui/material/Box';
import PageContainer from "../components/PageContainer";
import mongoose from 'mongoose';
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import getBroadcastModel, { Broadcast } from "../models/Broadcast";
import dbConnect from '../lib/dbConnect';
import { BookDriveStatus } from "../lib/enums";
import SearchBar from '../components/SearchBar';
import ProfileDisplayCase from '../components/ProfileDisplayCase';
import ProfileCard from '../components/ProfileCard';
import { getStates } from "../lib/enums";

type ProfileProps = {
  error: string | null;
  account: VolunteerAccount | null;
  drives: BookDrive[] | null;
  broadcasts: Broadcast[];
  allAccounts: VolunteerAccount[];
  query: string | null; // represents the query parameter if the profile search page is reached from the forum page
  userEmail: string;
  receivedFriendRequestList: string[];
};
// return {
//   props: {
//     broadcasts: JSON.parse(JSON.stringify(broadcasts)),
//     account: JSON.parse(JSON.stringify(volunteerAccount)) as VolunteerAccount,
//     drives: JSON.parse(JSON.stringify(drives)) as BookDrive,
//     allAccounts: JSON.parse(JSON.stringify(allAccounts)),
//     error: null,
//     query: query ? query : null,
//     session: session,
//   },
// };

const profile_search: NextPage<ProfileProps> = ({ broadcasts, account, drives, error, allAccounts, query, userEmail, receivedFriendRequestList}) => {
  const handleFriendRequest = () => {
    // Handle the logic for sending a friend request
    console.log('Friend request sent');
  };
  const backButtonStyle: React.CSSProperties = {
    color: '#FE9834',
    cursor: 'pointer',
    marginTop: '50px',
    marginLeft: '100px',
    marginBottom: '-50px',
    textDecoration: 'none', // Remove default link underline
    display: 'flex',
    alignItems: 'center', // Center items vertically
  };

  const backIconStyle: React.CSSProperties = {
    marginRight: '8px', // Adjust the right margin
    fontSize: '1.2em', // Set the font size for the "<" symbol
  };
  const handleRevokeFriendRequest = () => {
    // Handle the logic for revoking a friend request
    console.log('Friend request revoked');
  };

  const states = getStates();

  //console.log(receivedFriendRequestList);
  //console.log(states)
  const allProfiles = allAccounts.map((account) => ({
    name: `${account.fname} ${account.lname}`,
    //state: `${states[account.location - 1].name}`,
    email: `${account.email}`,
    profilePicture: `${account.pfpLink}`,
    badges: [
      {
        isEarned: true,
        level: 1,
        name: "Badge 1",
        description: "Badge 1 description",
      },
      {
        isEarned: false,
        level: 2,
        name: "Badge 2",
        description: "Badge 2 description",
      },
    ],
    affiliation: `${account.affiliation}`,
  }));
  
  const handleQueryChange = (query: string, filteredUsers: VolunteerAccount[]) => {
    if (query.trim() === '') {
      setFilteredProfiles([]); // If the query is empty, set filteredProfiles to an empty array
    } else {
      const filteredProfiles = allProfiles.filter((profile) =>
        profile.name.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredProfiles(filteredProfiles);

    }

  };
  


  const [filteredUsers, setFilteredUsers] = useState<VolunteerAccount[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<
    Array<{
      name: string;
      //state: string;
      email: string;
      profilePicture: string;
      badges: Array<{
        isEarned: boolean;
        level: number;
        name: string;
        description: string;
      }>;
      affiliation: string
    }>
  >([]);
  const users: VolunteerAccount[] = [ /* Add your user data here */];
  // if there was a query url param (coming from forum) then it should autosearch
  useEffect(() => {
    if (query) handleQueryChange(query, [])

  }, [])


  if (!account) {

    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px", flexDirection: "column" }}>
        <h1>{error}</h1>
        {error !== "You must login before accessing this page" && (
          <Link href="/dash-volunteer">
            <button style={{ width: "50px", height: "50px", borderRadius: "20%" }}>Volunteer Dashboard</button>
          </Link>
        )}
      </div>
    );
  }
  

  return (
    <Grid>
      <PageContainer
        broadcasts={broadcasts}
        fName={account.fname}
        currPage="profile_search"
      />
      <Grid
        container
        display="flex"
        padding={2}
        sx={{ pl: 20 }}
        rowSpacing={3}
      >
        <Grid item xs={12} sm={7} display="flex" flexDirection="column">
          <SearchBar
            users={users}
            onQueryChange={handleQueryChange}
          onBackToForum={() => { }}
          />
        </Grid>
        <Grid item xs={12} sm={7} display="flex" flexDirection="column" sx={{ cursor: "pointer" }}>
          <Link href="/forum">
            <a style={backButtonStyle}>
              <span style={backIconStyle}>&lt;</span> Back to Forum
            </a>
          </Link>
        </Grid>
        <Grid
          container
          display="flex"
          padding={1}
          sx={{ pl: 5 }}
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={5}
            mt={6}
            sx={{ margin: "25 0px" }}
          >
            {filteredProfiles && <ProfileDisplayCase account={account} userEmail={userEmail} profiles={filteredProfiles} useBadges={true} receivedFriendRequestList={receivedFriendRequestList} />}
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );

};
export const getServerSideProps = async (context: any) => {
  try {
    // get current session and email --> account of current user
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session || !session.user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false
        }
      }
    }
    const email = session.user.email

    const query = context.query.searchQuery

    await dbConnect()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel()
    const volunteerAccount: VolunteerAccount | null = await VolunteerAccount.findOne({ email: email });
    if (!volunteerAccount) throw new Error("Volunteer account not found")
    // findsall completed bookDrives that correspond to the volunteer account
    const promises = volunteerAccount!.driveIds.map(async (driveId: string) => await BookDrive.find({ driveCode: driveId, status: BookDriveStatus.Completed }));
    // you have to resolve these promises before continuing
    const resolvedPromises = await Promise.all(promises);
    // you have to flatten the array otherwise it will have a weird shape.
    const drives: BookDrive[] | null = resolvedPromises.flat()
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel();

    const allAccounts = (await VolunteerAccount.find({})) as VolunteerAccount[];

    const bPromises = volunteerAccount.broadcasts.map((broadcastId) => {
      const res = Broadcast.findOne({ id: broadcastId });
      if (!res) console.log("the bad broadcastId is", broadcastId);
      else return res;
    });
    const broadcasts = (await Promise.all(bPromises)) as Broadcast[];

    // prop for friend requests received from other users 
    const receivedFriendRequestList = []
    for (let i = 0; i < allAccounts.length; i++) {
      if (allAccounts[i].friendRequests.includes(volunteerAccount.email)) {
        receivedFriendRequestList.push(allAccounts[i].email);
      }
    }

    return {
      props: {
        broadcasts: JSON.parse(JSON.stringify(broadcasts)),
        account: JSON.parse(
          JSON.stringify(volunteerAccount)
        ) as VolunteerAccount,
        drives: JSON.parse(JSON.stringify(drives)) as BookDrive,
        allAccounts: JSON.parse(JSON.stringify(allAccounts)),
        error: null,
        query: query ? query : null,
        userEmail: email,
        receivedFriendRequestList: receivedFriendRequestList,
      },
    };
  } catch (e: Error | any) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return { props: { error: strError, account: null, drives: null, query: null } }
  }

}
export default profile_search