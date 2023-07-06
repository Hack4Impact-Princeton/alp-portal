import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import DriveCard from '../components/DriveCard'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel from '../models/VolunteerAccount';

function DashVolunteer(props) {
  let drives = null;
  let volunteer = null;
  let error = null;
  if (props.volunteer)  volunteer = JSON.parse(props.volunteer)
  if (props.drives) drives = JSON.parse(props.drives)
  if (props.error) error = JSON.parse(props.error)

  return (
    <Grid container>
      <Grid item xs={2}>
        <Navbar></Navbar>
      </Grid>
      <Grid item xs={10}>
        <Stack direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={5}>
            <div style={{marginTop: '5vh'}}>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <div style={{fontSize: '45px', textAlign:'left', fontWeight:'bold'}}>HOME</div>
                  <div style={{fontSize: '25px', textAlign:'left', marginTop: '2vh'}}>Active Drives</div>
                </Grid>
                <Grid item xs = {1}><img src="https://upload.wikimedia.org/wikipedia/en/d/de/AfricanLibraryProjectLogo.png" style={{width: '5vw'}}/></Grid>
              </Grid>
            </div>  
          <Link href={{pathname: "volunteeraccounts/profile",
           query: {alp_id: volunteer.alp_id}}}> Click here to go to your profile
          </Link>
          {drives && <Stack
            direction="column"
            justifyContent="flex-start"
            //alignItems="stretch"
            container spacing={10}>
              {drives.map((drive) => (
                <DriveCard drivename={drive.driveName}></DriveCard>
              ))}
          </Stack>}
        </Stack>
        </Grid>
    </Grid>
  );
}
  
export async function getServerSideProps(context) {
  try {
    await dbConnect()
    const alp_id = context.query.alp_id
    const VolunteerAccount = getVolunteerAccountModel()
    const BookDrive = getBookDriveModel();
    const volunteerAccount = await VolunteerAccount.findOne({alp_id: alp_id})
    const driveList = volunteerAccount.driveIds
    // finds all bookdrives that correspond to the volunteerAccount
    const promises = driveList.map(driveId => BookDrive.find({driveCode: driveId}));
    const drives = await Promise.all(promises);
    return { props: { drives: JSON.stringify(drives), volunteer: JSON.stringify(volunteerAccount) } }
  } catch (error) {
    console.log(error)
    return {props: {error: JSON.stringify(error)}}
  }
}




export default DashVolunteer