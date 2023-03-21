import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DashviewDriveCard from '../components/DashviewDriveCard'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';

// import dbConnect from '../lib/dbConnect'

function DashVolunteer() {
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
              <DashviewDriveCard></DashviewDriveCard>
              <DashviewDriveCard></DashviewDriveCard>
              <DashviewDriveCard></DashviewDriveCard>
              <DashviewDriveCard></DashviewDriveCard>
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