import mongoose from 'mongoose'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import DriveCard from '../components/DriveCard'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import dbConnect from '../lib/dbConnect'
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { getSession } from 'next-auth/react';
import { NextPage } from 'next';
import { CustomSession, VolunteerUser } from '../types/NextauthUser';
import getAdminAccountModel, { AdminAccount } from '../models/AdminAccount';
type DashVolunteerProps = {
  drives: BookDrive[] | null;
  account: VolunteerAccount | null;
  error: Error | null;
}


const DashVolunteer: NextPage<DashVolunteerProps> = ({ drives, account, error }) => {
  console.log(account)
  console.log("drives", drives)
  if (account) {
    return (
      <Grid2>
        <PageContainer fName={account.fname} currPage="dash-volunteer"></PageContainer>
        {/* Necessary box for padding the page body, no overlap with Navbar */}
        <Box display="flex" flexDirection="column" sx={{
          pl: 20,
          pt: 5,
          pr: 5,
          width: '100%',
          justifyContent: "space-between"
        }}>
          <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh', marginBottom: '2vh' }}>Active Drives</div>
          {/* <Link href="volunteeraccounts/profile"> Click here to go to your profile
          </Link> */}
          {drives && <Stack
            direction="column"
            justifyContent="center"
            spacing={6}>
            {drives.map((drive) => (
              <DriveCard drive={drive}></DriveCard>
            ))}
          </Stack>}
          
        </Box>
        </Grid2>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <h1>{error?.message}</h1>
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
    const driveList = account.driveIds
    const promises = driveList.map(driveId => BookDrive.findOne({ driveCode: driveId }))
    drives = await Promise.all(promises) as BookDrive[]
    console.log("drives", drives)
    return { props: { drives: drives ? JSON.parse(JSON.stringify(drives)) : null, account: JSON.parse(JSON.stringify(account)) } }
  } catch (e: Error | any) {
    console.log(e)
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
    return { props: { error: strError } }
  }
}


export default DashVolunteer
