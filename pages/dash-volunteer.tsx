import mongoose from 'mongoose'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import DriveCard from '../components/DriveCard'
// import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import dbConnect from '../lib/dbConnect'
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { getSession } from 'next-auth/react';
import { NextPage } from 'next';
import getBroadcastModel, { Broadcast } from '../models/Broadcast';
import { useState, useEffect } from 'react'
import BroadcastMessage from '../components/BroadcastMessage'
type DashVolunteerProps = {
  drives: BookDrive[] | null;
  account: VolunteerAccount | null;
  broadcasts: Broadcast[] | null;
  error: Error | null;
}
interface isReadMapType {
  myMap: Map<string, boolean>
}

const DashVolunteer: NextPage<DashVolunteerProps> = ({ drives, account, error, broadcasts }) => {

  if (account) {
    return (
      <>
        <Grid>
          <PageContainer fName={account.fname} currPage="dash-volunteer" email={account.email} broadcasts={broadcasts}></PageContainer>
          {/* Necessary box for padding the page body, no overlap with Navbar */}
          <Box display="flex" flexDirection="column" sx={{
            pl: 20,
            pt: 5,
            pr: 5,
            width: '100%',
            justifyContent: "space-between"
          }}>
            <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh' }}>Active Drives</div>
            <Link href="volunteeraccounts/profile"> Click here to go to your profile
            </Link>
            {drives && <Stack
              direction="column"
              justifyContent="flex-start"
              spacing={10}>
              {drives.map((drive) => (
                <DriveCard drivename={drive.driveName}></DriveCard>
              ))}
            </Stack>}
          </Box>
        </Grid>
        <Grid container style={{ display: 'flex', flexDirection: "row" }}>
          <Grid item>
            <Navbar active="dash-volunteer" />
          </Grid>
          <Grid item>
            <Box display="flex" flexDirection="column" sx={{
              pl: 20,
              pt: 5,
              pr: 5,
              width: '100%',
              justifyContent: "space-between"
            }} >

              <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh' }}>Active Drives</div>
              <Link href="volunteeraccounts/profile"> Click here to go to your profile
              </Link>
              {drives && <Stack
                direction="column"
                justifyContent="flex-start"
                spacing={10}>
                {drives.map((drive) => (
                  <DriveCard key={drive.driveCode} drivename={drive.driveName}></DriveCard>
                ))}
              </Stack>}
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        {error && <h1>{error.message}</h1>}
      </div>
    )
  }
}

export async function getServerSideProps(context: any) {
  try {
    await dbConnect()
    const session = await getSession(context)
    console.log("SESSION OBJ: ", session);
    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        }
      }
    }
    if (session.user?.name == 'true') {
      return {
        redirect: {
          destination: '/admin/dashboard',
          permanent: false
        }
      }
    }
    const email = session.user?.email
    let account: VolunteerAccount
    let drives: BookDrive[] | null | undefined = null
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    account = await VolunteerAccount.findOne({ email: email }) as VolunteerAccount
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const promises = account.driveIds.map(driveId => BookDrive.findOne({ driveCode: driveId }))
    drives = await Promise.all(promises) as BookDrive[]
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel()
    let broadcasts: Broadcast[] | undefined | null = null
    const broadcastPromises = account.broadcasts.map(broadcastId => Broadcast.findOne({ id: broadcastId }))
    broadcasts = await Promise.all(broadcastPromises) as Broadcast[]
    return { props: { drives: drives ? JSON.parse(JSON.stringify(drives)) : null, account: account ? JSON.parse(JSON.stringify(account)) : null, broadcasts: broadcasts ? JSON.parse(JSON.stringify(broadcasts)) : null } }
  } catch (e: Error | any) {
    console.log(e)
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
    return { props: { error: strError } }
  }
}


export default DashVolunteer
