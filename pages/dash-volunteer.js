import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DriveCard from '../components/DriveCard'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';


function DashVolunteer() {
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
              <DriveCard
                drivename="Uganda Community College"
                progress="500"
                drivesize="10" // drive size is 100 * 10
              ></DriveCard>
              <DriveCard progress="200" drivesize="10"></DriveCard>
              <DriveCard progress="200" drivesize="10"></DriveCard>
              <DriveCard progress="200" drivesize="10"></DriveCard>
          </Stack>
        </Stack>
     
    </Grid>
  );
}

/* Keep example code here, nothing should be dynamic on the home page */
//   export async function getServerSideProps() {
//     await dbConnect()

//     /* find all the data in our database */
//     const result = await Pet.find({})
//     const pets = result.map((doc) => {
//       const pet = doc.toObject()
//       pet._id = pet._id.toString()
//       return pet
//     })

//     return { props: { pets: pets } }
//   }
/* end example pet code */

export default DashVolunteer