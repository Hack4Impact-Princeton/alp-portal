import getVolunteerAccountModel from "../../models/VolunteerAccount"
import dbConnect from '../../lib/dbConnect'
import Grid2 from "@mui/material/Unstable_Grid2"
import Box from '@mui/material/Box';
import Navbar from "../../components/Navbar";
import {useState} from 'react'
import MapComponent from '../../components/MapComponent'
import Link from 'next/link'
import getBookDriveModel from "../../models/BookDrive"

const Profile = (props) => {
  const [isHovered, setIsHovered] = useState(false)

  let account = JSON.parse(props.account)
  // drives will be passed as props to the mapComponent
  let drives = JSON.parse(props.completedDrives)
 
  
  return (
    <Grid2>
      <Grid2><Navbar /></Grid2>
      
      <Box display="flex" sx={{ pl: 20, pt: 5, pr: 5, width: '100%', justifyContent: "space-between" }} >
        <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>Profile </h1>
        <Link href={`/volunteeraccounts/edit?alp_id=${account.alp_id}`}>
          <button style={{borderRadius: "20%", height: 'auto', justifyContent: 'flex-end', backgroundColor: isHovered ? "darkgray": "white"}} onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}>Edit Profile</button>
        </Link>
        <img display="flex" style={{justifyContent: "flex-end"}} src="/alp-logo.png" alt="alp-logo" height="55px"></img>
      </Box>
      <Grid2 container display="flex" padding={5} sx={{ pl: 20 }} rowSpacing={2}>
        <Grid2 item xs={12} sm={7} display="flex" flexDirection="column" >
          <Box
            sx={{
              width: "100%",
              height: "175px",
              border: '1.5px solid black',
              display: 'flex',
              marginBottom: '10px',
              '@media (min-width: 600px)': {
                display: 'flex',
                width: '95%',
              },
            }}
          >
            <div
              style={{
                width: '35%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                alt="Pofile Image"
                style={{
                  borderRadius: '50%',
                  width: '70%',
                  height: 'auto',
                }}
              />
            </div>
            <div
              style={{
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                paddingLeft: '10px',
              }}
            >
              <p>{`${account.fname} ${account.lname}`}</p>
              <p>{account.email}</p>
              <p>{`# of Bookdrives completed: ${account.allDrives}`}</p>
            </div>
          </Box>
        </Grid2>
        <Grid2 item xs={12} sm={5} height={"450px"} >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              border: "1.5px solid black",
              '@media (min-width: 600px)': {
                display: 'inline-block',
                width: '100%',
                height: '100%'
              },
              maxWidth: "450px",
            }}>
            <MapComponent  drives={drives}/>
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>

  )
}

export const getServerSideProps = async (context) => {
  await dbConnect()
  const VolunteerAccount = getVolunteerAccountModel()
  const BookDrive = getBookDriveModel()
  const alp_id = context.query.alp_id
  const volunteerAccount = await VolunteerAccount.findOne({ alp_id: alp_id })
  const driveList = volunteerAccount.driveIds
    // finds all completed bookDrives that correspond to the volunteer account
  const promises = driveList.map(driveId => BookDrive.find({driveCode: driveId, status: 1}));
  const completedDrives = await Promise.all(promises);
  return { props: { account: JSON.stringify(volunteerAccount), completedDrives: JSON.stringify(completedDrives) } }
}

export default Profile