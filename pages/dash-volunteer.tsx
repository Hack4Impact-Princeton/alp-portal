import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Router from 'next/router';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

import Navbar from '../components/Navbar';
import DriveCard from '../components/DriveCard';
import dbConnect from '../lib/dbConnect';
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { useSession } from 'next-auth/react';
import mongoose from 'mongoose';

interface Drive {
  driveName: string;
}

interface Props {
  drives: string | null;
  volunteer: string | null;
  error: string | null;
}

function DashVolunteer(props: Props) {
  const [drives, setDrives] = useState<Drive[] | null>(null);
  const [volunteer, setVolunteer] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/auth/login');
  }, [status])

  useEffect(() => {
    if (props.drives) setDrives(JSON.parse(props.drives));
    if (props.volunteer) setVolunteer(JSON.parse(props.volunteer));
    if (props.error) setError(props.error);
  }, [props.drives, props.volunteer, props.error])

  if (status === 'loading') return <div>Loading...</div>

  if (volunteer) {
    return (
      <Grid2>
        <Grid2>
          <Navbar active="dash-volunteer" />
        </Grid2>

        <Box
          display="flex"
          flexDirection="column"
          sx={{
            pl: 20,
            pt: 5,
            pr: 5,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ textAlign: 'left', fontSize: '90px', paddingRight: 10 }}>Home</h1>
          <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh' }}>Active Drives</div>
          <Link href="volunteeraccounts/profile">Click here to go to your profile</Link>
          {drives && (
            <Stack direction="column" justifyContent="flex-start" spacing={10}>
              {drives.map((drive: Drive) => (
                <DriveCard drivename={drive.driveName} />
              ))}
            </Stack>
          )}
        </Box>
      </Grid2>
    );
  } else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
        <h1>{error}</h1>
      </div>
    );
  }
}

export async function getServerSideProps(context: any) {
  try {
    await dbConnect();
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        }
      }
    }
    console.log(session.user);
    const email = session.user!.email;
    const VolunteerAccount : mongoose.Model<VolunteerAccount> = getVolunteerAccountModel();
    const BookDrive : mongoose.Model<BookDrive> = getBookDriveModel();
    const volunteerAccount = await VolunteerAccount.findOne({ email: email });
    const driveList = volunteerAccount!.driveIds;
    const promises = driveList.map((driveId: string) => BookDrive.find({ driveCode: driveId }));
    const drives = await Promise.all(promises);

    return { props: { drives: JSON.stringify(drives), volunteer: JSON.stringify(volunteerAccount) } };
  } catch (e : Error | any) {
    console.log(e);
    let strError =
      e.message === "Cannot read properties of null (reading 'user')"
        ? 'You must login before accessing this page'
        : `${e}`;

    return { props: { error: strError } };
  }
}

export default DashVolunteer;
