import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import DriveCard from '../components/DriveCard'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel from '../models/VolunteerAccount';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Router from 'next/router';
import { getSession } from 'next-auth/react';

function DashVolunteer(props) {
  let drives = props.drives ? JSON.parse(props.drives) : null;
  let volunteer = props.volunteer ? JSON.parse(props.volunteer): null;
  let error = props.error ? props.error : null
  
  // if the user is not authenticated take them back to the login page
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/auth/login')
  }, [status])

  if (status === 'loading') return <div>Loading...</div>
  if (volunteer) {
    return (
      <Grid2>
        <Grid2><Navbar active="dash-volunteer"/></Grid2>

        <Box display="flex" flexDirection="column" sx={{
          pl: 20,
          pt: 5,
          pr: 5,
          width: '100%',
          justifyContent: "space-between"
        }} >
          <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>Home</h1>
          <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh' }}>Active Drives</div>
          <Link href="volunteeraccounts/profile"> Click here to go to your profile
          </Link>
          {drives && <Stack
            direction="column"
            justifyContent="flex-start"
            container spacing={10}>
            {drives.map((drive) => (
              <DriveCard drivename={drive.driveName}></DriveCard>
            ))}
          </Stack>}
        </Box>
      </Grid2>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <h1>{error}</h1>
      </div>
    )

  }
}

export async function getServerSideProps(context) {
  try {
    await dbConnect()
    const session = await getSession(context)
    console.log(session.user)
    const email = session.user.email
    const VolunteerAccount = getVolunteerAccountModel()
    const BookDrive = getBookDriveModel();
    const volunteerAccount = await VolunteerAccount.findOne({ email: email })
    const driveList = volunteerAccount.driveIds
    // finds all bookdrives that correspond to the volunteerAccount
    const promises = driveList.map(driveId => BookDrive.find({ driveCode: driveId }));
    const drives = await Promise.all(promises);

    return { props: { drives: JSON.stringify(drives), volunteer: JSON.stringify(volunteerAccount) } }
  } catch (e) {
    console.log(e)
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
    return { props: { error: strError } }
  }
}




export default DashVolunteer