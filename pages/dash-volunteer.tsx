import mongoose from 'mongoose'
import Box from '@mui/material/Box';
import PageContainer from '../components/PageContainer';
import DriveCard from '../components/DriveCard'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import dbConnect from '../lib/dbConnect'
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { NextPage } from 'next';

import useDynamicPadding from '../lib/useDynamicPadding';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
const DashVolunteer: NextPage<{drives: BookDrive[] | null, account: VolunteerAccount | null, error: Error | null}> = ({ drives, account, error }) => {
  console.log(account)
  console.log("drives", drives)

  const leftPaddingValue = useDynamicPadding(635, 775, "29vw", "20vw", "15vw")

  if (account) {
    return (
      <Grid2>
        <PageContainer fName={account.fname} currPage="dash-volunteer" ></PageContainer>
        {/* Necessary box for padding the page body, no overlap with Navbar */}
        <Box display="flex" flexDirection="column" sx={{
          pl: leftPaddingValue,
          pt: "5vh",
          pr: "5vw",
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
    const session = await getServerSession(context.req, context.res, authOptions)
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
