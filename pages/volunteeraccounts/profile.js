import getVolunteerAccountModel from "../../models/VolunteerAccount"
import dbConnect from '../../lib/dbConnect'
import Router from 'next/router'
import { useSession } from "next-auth/react"
import Grid2 from "@mui/material/Unstable_Grid2"
import Box from '@mui/material/Box';
import Navbar from "../../components/Navbar";
import { useState, useEffect } from 'react'
import { signOut } from "next-auth/react"
import MapComponent from '../../components/MapComponent'
import Link from 'next/link'
import { getSession } from "next-auth/react"

import getBookDriveModel from "../../models/BookDrive"

const Profile = (props) => {
  let account = props.account ? JSON.parse(props.account) : null
  let drives = props.completedDrives ? JSON.parse(props.completedDrives) : null
  let error = props.error ? props.error : null

  // if the user is not logged in take them back to the login page
  const [editIsHovered, setEditIsHovered] = useState(false)
  const [signOutIsHovered, setSignOutIsHovered] = useState(false)

  // if the account is not null, that means that everything is working
  // otherwise render the error message page
  if (account) {
    return (
      <Grid2>
        <Grid2><Navbar active="profile" /></Grid2>
        <Box display="flex" sx={{ pl: 20, pt: 5, pr: 5, width: '100%', justifyContent: "space-between" }} >
          <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>Profile</h1>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              borderRadius: "20%",
              width: "100px",
              height: 'auto',
              justifyContent: 'flex-end',
              backgroundColor: signOutIsHovered ? "darkgray" : "white"
            }}
            onMouseEnter={() => setSignOutIsHovered(true)}
            onMouseLeave={() => setSignOutIsHovered(false)}
          >Sign Out</button>
          <Link href={`/volunteeraccounts/edit`}>
            <button style={{
              borderRadius: "20%", height: 'auto', width: "100px",
              justifyContent: 'flex-end',
              backgroundColor: editIsHovered ? "darkgray" : "white"
            }}
              onMouseEnter={() => setEditIsHovered(true)}
              onMouseLeave={() => setEditIsHovered(false)}>Edit Profile</button>
          </Link>
          <img display="flex" justifyContent="flex-end" src="/alp-logo.png" alt="alp-logo" height="55px"></img>
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
          <Grid2 item xs={12} sm={5} height={"450px"}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                border: "1.5px solid black",
                '@media (min-width: 600px)': {
                  display: 'inline-block',
                  width: '100%',
                  height: '100%',
                },
                maxWidth: "450px",
              }}>
              <MapComponent drives={drives}/>
            </Box>
          </Grid2>
        </Grid2>
      </Grid2>
    )
  }
  else return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px", flexDirection: "column"}}>
      <h1>{error}</h1>
      {// when the error is not an auth error give them the button to go back
      error !== "You must login before accessing this page" && 
      <Link href="/dash-volunteer">
          <button width="50px" height="50px" borderRadius="20%">Volunteer Dashboard</button>
      </Link>}
    </div>
  )
}

export const getServerSideProps = async (context) => {
  try {
    // get current session and email --> account of current user
    const session = await getSession(context)
    // if (session) console.log("hiiii")
    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false
        }
      }
    }
    const email = session.user.email
    await dbConnect()
    const VolunteerAccount = getVolunteerAccountModel()
    const BookDrive = getBookDriveModel()
    const volunteerAccount = await VolunteerAccount.findOne({ email: email })
    const driveList = volunteerAccount.driveIds
    // finds all completed bookDrives that correspond to the volunteer account
    const promises = driveList.map(async (driveId) => await BookDrive.find({driveCode: driveId, status: 1}));
    const completedDrives = await Promise.all(promises);
  return { props: { account: JSON.stringify(volunteerAccount), completedDrives: JSON.stringify(completedDrives), error: null } }
  } catch (e) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return { props: { error: strError, account: null } }
  }

}

export default Profile