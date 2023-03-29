import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from '../models/BookDrive';
import DriveCard from '../components/DriveCard'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';

function DashVolunteer(props) {
  // parse stringified json
  let drives = JSON.parse(props.drives)
  console.log(drives)
  return (
    <Grid>
      <Grid><Navbar></Navbar></Grid>
        <Stack direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={5}>
            <div style={{marginTop: '2vh'}}>
              <div style={{fontSize: '35px', textAlign:'center'}}>Welcome to ALP Portal!</div>
              <div style={{fontSize: '25px', textAlign:'center', marginTop: '2vh'}}>Active Drives</div>
            </div>  
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            container spacing={10}>
              <DriveCard
                drivename="Uganda Community College"
              ></DriveCard>
              <DriveCard></DriveCard>
              <DriveCard></DriveCard>
              <DriveCard></DriveCard>
          </Stack>
        </Stack>
     
    </Grid>
  );
}
  
export async function getServerSideProps() {
  await dbConnect()
  const BookDrive = getBookDriveModel();
  /* find all the data in our database */
  const drives = await BookDrive.find({})
  // stringify data before sending
  return { props: { drives: JSON.stringify(drives) } }
}




export default DashVolunteer