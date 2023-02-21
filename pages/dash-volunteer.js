import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Drawer from '@mui/material';
import Stack from '@mui/material/Stack';

// import dbConnect from '../lib/dbConnect'

function DashVolunteer() {
  return (
    <div>
        <Navbar></Navbar>
        <Stack direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={5}>
            <Grid container columnSpacing={5}>
              <Grid>
                <div style={{fontSize: '20px', backgroundColor: 'yellow'}}>Welcome to ALP Portal!</div>
                <div style={{fontSize: '20px', backgroundColor: 'red'}}>Active Drives</div>
              </Grid>
            </Grid>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={20} sx={{backgroundColor:'yellow'}}>
              <div style={{backgroundColor:"blue"}}>Placeholder 1</div>
              <div style={{backgroundColor:"blue"}}>Placeholder 2</div>
              <div style={{backgroundColor:"blue"}}>Placeholder 3</div>
              <div style={{backgroundColor:"blue"}}>Placeholder 4</div>
              <div style={{backgroundColor:"blue"}}>Placeholder 5</div>
          </Stack>
        </Stack>
        
    </div>
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