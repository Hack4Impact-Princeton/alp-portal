import getVolunteerAccountModel, { VolunteerAccount } from "../../models/VolunteerAccount";
import dbConnect from '../../lib/dbConnect';
import {Grid} from "@mui/material";
import Box from '@mui/material/Box';
import PageContainer from "../../components/PageContainer";
import { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import MapComponent from '../../components/MapComponent';
import Link from 'next/link';
import { getSession } from "next-auth/react";
import { BookDriveStatus } from "../../lib/enums";
import getBookDriveModel, { BookDrive } from "../../models/BookDrive";
import {NextPage} from 'next';
import mongoose from 'mongoose';
import getBroadcastModel, { Broadcast } from "../../models/Broadcast";

type ProfileProps = {
  error: string | null;
  account: VolunteerAccount | null;
  drives: BookDrive[] | null;
  broadcasts: Broadcast[] | null;
}

const Profile: NextPage<ProfileProps> = ({error, account, drives, broadcasts}) => {


  // if the user is not logged in take them back to the login page
  const [editIsHovered, setEditIsHovered] = useState(false)
  const [signOutIsHovered, setSignOutIsHovered] = useState(false)

  // if the account is not null, that means that everything is working
  // otherwise render the error message page
  if (account) {
    console.log("ACCOUNT: ", account);
    return (
      <Grid>
        <PageContainer fName={account.fname} currPage="profile" email={account.email} broadcasts={broadcasts}></PageContainer>
        <Box display="flex" sx={{ pl: 20, pt: 5, pr: 5, width: '100%', justifyContent: 'space-between' }}>
      <button
        onClick={() => signOut({callbackUrl: "/"})}
        style={{
          borderRadius: '20%',
          width: '100px',
          height: 'auto',
          justifyContent: 'flex-end',
          backgroundColor: signOutIsHovered ? 'darkgray' : 'white'
        }}
        onMouseEnter={() => setSignOutIsHovered(true)}
        onMouseLeave={() => setSignOutIsHovered(false)}
      >
        Sign Out
      </button>
      <Link href="/volunteeraccounts/edit">
        <button
          style={{
            borderRadius: '20%',
            height: 'auto',
            width: '100px',
            justifyContent: 'flex-end',
            backgroundColor: editIsHovered ? 'darkgray' : 'white'
          }}
          onMouseEnter={() => setEditIsHovered(true)}
          onMouseLeave={() => setEditIsHovered(false)}
        >
          Edit Profile
        </button>
      </Link>
      <img style = {{display: "flex", justifyContent: "flex-end", height: "55px"}}src="/alp-logo.png" alt="alp-logo" />
    </Box>
        <Grid container display="flex" padding={5} sx={{ pl: 20 }} rowSpacing={2}>
          <Grid item xs={12} sm={7} display="flex" flexDirection="column" >
            <Box
              sx={{
                width: "100%",
                height: "175px",
                border: '1.5px solid black',
                display: 'flex',
                marginBottom: '10px',
                '@media (min-width: 600px)': {
                  display: 'flex',
                  width: '95%',
                },
              }}
            >
              <div
                style={{
                  width: '35%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                  alt="Pofile Image"
                  style={{
                    borderRadius: '50%',
                    width: '70%',
                    height: 'auto',
                  }}
                />
              </div>
              <div
                style={{
                  width: '65%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                  paddingLeft: '10px',
                }}
              >
                <p>{`${account.fname} ${account.lname}`}</p>
                <p>{account.email}</p>
                <p>{`# of Bookdrives completed: ${drives!.length}`}</p>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} height={"450px"}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                border: "1.5px solid black",
                '@media (min-width: 600px)': {
                  display: 'inline-block',
                  width: '100%',
                  height: '100%',
                },
                maxWidth: "450px",
              }}>
              <MapComponent drives={drives? drives: []} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  else return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px", flexDirection: "column" }}>
      <h1>{error}</h1>
      {// when the error is not an auth error give them the button to go back
        error !== "You must login before accessing this page" &&
        <Link href="/dash-volunteer">
          <button style = {{width:"50px", height:"50px", borderRadius:"20%"}}>Volunteer Dashboard</button>
        </Link>}
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  try {
    // get current session and email --> account of current user
    const session = await getSession(context)
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
    const volunteerAccount: VolunteerAccount | null = await VolunteerAccount.findOne({ email: email }) as VolunteerAccount;

    // findsall completed bookDrives that correspond to the volunteer account
    const promises = volunteerAccount!.driveIds.map(async (driveId: string) => await BookDrive.find({driveCode: driveId, status: BookDriveStatus.Completed}));
    // you have to resolve these promises before continuing
    const resolvedPromises = await Promise.all(promises);
    // you have to flatten the array otherwise it will have a weird shape.
    const drives: BookDrive[] | null = resolvedPromises.flat()
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel()
    let broadcasts: Broadcast[] | undefined | null = null
    const broadcastPromises = volunteerAccount!.broadcasts.map(broadcastId => Broadcast.findOne({ id: broadcastId }))
    broadcasts = await Promise.all(broadcastPromises) as Broadcast[]
  return { props: { account: JSON.parse(JSON.stringify(volunteerAccount)), drives: JSON.parse(JSON.stringify(drives)), broadcasts: JSON.parse(JSON.stringify(broadcasts)), error: null } }
  } catch (e: Error|any) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return { props: { error: strError, account: null, drives: null, broadcasts: null} }
  }

}

export default Profile