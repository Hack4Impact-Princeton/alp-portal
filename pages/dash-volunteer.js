import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import DriveCard from '../components/DriveCard'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from '../models/BookDrive';

function DashVolunteer(props) {
  // parse stringified json
  let drives = JSON.parse(props.drives)
  console.log(drives)
  return (
    <Grid>
      <Grid><Navbar></Navbar></Grid>
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
          <Stack
            direction="column"
            justifyContent="flex-start"
            //alignItems="stretch"
            container spacing={10}>
              {drives.map((drive) => (
                <DriveCard drivename={drive.driveName}></DriveCard>
              ))}
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