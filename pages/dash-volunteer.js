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
    <Grid2>
      <Grid2><Navbar/></Grid2>

      <Box display="flex" flexDirection="column" sx={{ 
        pl: 20, 
        pt: 5, 
        pr: 5, 
        width: '100%', 
        justifyContent: "space-between"}} >
        <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>Home</h1>
        <div style={{fontSize: '25px', textAlign:'left', marginTop: '2vh'}}>Active Drives</div>
        <Link href={{pathname: "volunteeraccounts/profile",
           query: {alp_id: volunteer.alp_id}}}> Click here to go to your profile
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

  // return (
  //   <Grid2 container>
  //     <Grid2 sx={{
  //       backgroundColor: "blue"
  //     }}><Navbar></Navbar></Grid2>
  //     <Grid2 sx={{
  //       backgroundColor: "green"
  //     }}>
  //       <Stack direction="column"
  //         justifyContent="flex-start"
  //         alignItems="stretch"
  //         spacing={5}
  //         sx={{
  //           backgroundColor: 'orange'
  //         }}>
  //           <div style={{marginTop: '5vh'}}>
  //             <Grid2 container spacing={2}>
  //               <Grid2 item xs={11} sx={{
  //                 backgroundColor: "yellow"
  //               }}>
  //                 <div style={{fontSize: '45px', textAlign:'left', fontWeight:'bold'}}>HOME</div>
  //                 <div style={{fontSize: '25px', textAlign:'left', marginTop: '2vh'}}>Active Drives</div>
  //               </Grid2>
  //               <Grid2 item xs = {1}><img src="https://upload.wikimedia.org/wikipedia/en/d/de/AfricanLibraryProjectLogo.png" style={{width: '5vw'}}/></Grid2>
  //             </Grid2>
  //           </div>  
  //         <Link href={{pathname: "volunteeraccounts/profile",
  //          query: {alp_id: volunteer.alp_id}}}> Click here to go to your profile
  //         </Link>
  //         {drives && <Stack
  //           direction="column"
  //           justifyContent="flex-start"
  //           //alignItems="stretch"
  //           container spacing={10}>
  //             {drives.map((drive) => (
  //               <DriveCard drivename={drive.driveName}></DriveCard>
  //             ))}
  //         </Stack>}
  //       </Stack>
  //     </Grid2>
  //   </Grid2>
  // );
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