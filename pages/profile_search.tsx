import { ProfilerProps } from 'react';
import Navbar from '../components/Navbar';
import { NextPage } from 'next';
import useDynamicPadding from '../lib/useDynamicPadding';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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

type ProfileProps = {
  error: string | null;
  account: VolunteerAccount | null;
  drives: BookDrive[] | null;
  broadcasts: Broadcast[];
}
type BadgeInfoProps = {
  isEarned: boolean,
  level: number,
  name: string,
  description: string,
}
const BadgeInfo: React.FC<BadgeInfoProps> = ({ isEarned, level, name, description }) => {
  const unlockedBadgeStyle = {
    width: '40px',
    height: '40px',
    marginBottom: '5px',
  };

  const lockedBadgeStyle = {
    width: '40px',
    height: '40px',
    marginBottom: '5px',
    filter: 'grayscale(100%)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
      {isEarned ? (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1435/1435715.png"
          alt="Unlocked Badge"
          style={unlockedBadgeStyle}
        />
      ) : (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1435/1435722.png"
          alt="Locked Badge"
          style={lockedBadgeStyle}
        />
      )}
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{description}</p>
      </div>
    </div>
  );
};
const BadgeDisplayCase = () => {
  const badges = [
    {
      isEarned: true,
      level: 1,
      name: 'Ivy',
      description: 'ivy being nice for once',
    },
    {
      isEarned: false,
      level: 2,
      name: 'ivy',
      description: 'ivy saving us!',
    },
    // Add more badges here
  ];

  return (
    <Grid container style={{
      border: '1.5px solid black', padding: '10px', marginBottom: '10px', display: 'flex',
      width: '95%',
      backgroundColor: "#F5F5F5"

    }}>
      <Grid xs={12} ><h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Badges</h2></Grid>
      <Grid container xs={12} style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', paddingLeft: '10px' }}>
        {badges.map((badge, index) => (
          <BadgeInfo key={index} {...badge} />
        ))}
      </Grid>
    </Grid>
  );
};
const profile_search: NextPage<ProfileProps> = ({ error, broadcasts, account, drives }) => {
  console.log("Profile Page");

  if (account) {
    console.log("ACCOUNT: ", account);
    const [filteredUsers, setFilteredUsers] = useState<VolunteerAccount[]>([]);
    const users: VolunteerAccount[] = [ /* Add your user data here */ ];

    const handleQueryChange = (query: string, filteredUsers: VolunteerAccount[]) => {
      setFilteredUsers(filteredUsers);
    };

    return (
      <Grid>
        <PageContainer broadcasts={broadcasts} fName={account.fname} currPage="profile_search" />
        <SearchBar users={users} onQueryChange={handleQueryChange} />
        <ul>
          {filteredUsers.map((user, index) => (
            <li key={index}>
              {`${user.fname} ${user.lname} - ${user.email}`}
            </li>
          ))}
        </ul>
      </Grid>
    );
  } else {
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
};
export const getServerSideProps = async (context: any) => {
  try {
    // get current session and email --> account of current user
    const session = await getServerSession(context.req, context.res, authOptions)
    // if (session) console.log("hiiii")
    if (!session || !session.user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false
        }
      }
    }
    const email = session.user.email
    
    await dbConnect()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel()
    const volunteerAccount: VolunteerAccount | null = await VolunteerAccount.findOne({ email: email });
    if(!volunteerAccount) throw new Error("Volunteer account not found")
    // findsall completed bookDrives that correspond to the volunteer account
    const promises = volunteerAccount!.driveIds.map(async (driveId: string) => await BookDrive.find({ driveCode: driveId, status: BookDriveStatus.Completed }));
    // you have to resolve these promises before continuing
    const resolvedPromises = await Promise.all(promises);
    // you have to flatten the array otherwise it will have a weird shape.
    const drives: BookDrive[] | null = resolvedPromises.flat()
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel();
    
    console.log(volunteerAccount.broadcasts);
    const bPromises = volunteerAccount.broadcasts.map((broadcastId) => {
      const res = Broadcast.findOne({ id: broadcastId });
      if (!res) console.log("the bad broadcastId is", broadcastId);
      else return res;
    });
    const broadcasts = (await Promise.all(bPromises)) as Broadcast[];
    return { props: { broadcasts: JSON.parse(JSON.stringify(broadcasts)), account: JSON.parse(JSON.stringify(volunteerAccount)) as VolunteerAccount, drives: JSON.parse(JSON.stringify(drives)) as BookDrive, error: null } }
  } catch (e: Error | any) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return { props: { error: strError, account: null, drives: null } }
  }

}
export default profile_search