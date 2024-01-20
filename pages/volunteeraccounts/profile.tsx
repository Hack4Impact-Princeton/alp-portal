import getVolunteerAccountModel, { VolunteerAccount } from "../../models/VolunteerAccount";
import dbConnect from '../../lib/dbConnect';
import { Grid, IconButton, Button, TextField, FormControl, InputLabel, Select, OutlinedInput, MenuItem, SelectChangeEvent } from "@mui/material";
import Box from '@mui/material/Box';
import PageContainer from "../../components/PageContainer";
import React, { useState, useRef } from 'react';
import { signOut } from "next-auth/react";
import MapComponent from '../../components/MapComponent';
import Link from 'next/link';
import { BookDriveStatus, getStates } from "../../lib/enums";
import getBookDriveModel, { BookDrive } from "../../models/BookDrive";
import { NextPage } from 'next';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import getBroadcastModel, { Broadcast } from "../../models/Broadcast";
import { PhotoCamera } from "@mui/icons-material";
import { imageDelete, imagePfpUpload } from "../../db_functions/imageDB";
import CircularIcon from "../../components/CircularIcon";
type ProfileProps = {
  error: string | null;
  account: VolunteerAccount | null;
  drives: BookDrive[] | null;
  broadcasts: Broadcast[];
}
type BadgeInfoProps = {
  isEarned: boolean,
  level: number,
  name: string,
  description: string,
}

const BadgeInfo: React.FC<BadgeInfoProps> = ({ isEarned, level, name, description }) => {
  const unlockedBadgeStyle = {
    width: '40px',
    height: '40px',
    marginBottom: '5px',
  };

  const lockedBadgeStyle = {
    width: '40px',
    height: '40px',
    marginBottom: '5px',
    filter: 'grayscale(100%)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
      {isEarned ? (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1435/1435715.png"
          alt="Unlocked Badge"
          style={unlockedBadgeStyle}
        />
      ) : (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1435/1435722.png"
          alt="Locked Badge"
          style={lockedBadgeStyle}
        />
      )}
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{description}</p>
      </div>
    </div>
  );
};

const BadgeDisplayCase = () => {
  const badges = [
    {
      isEarned: true,
      level: 1,
      name: 'Ivy',
      description: 'ivy being nice for once',
    },
    {
      isEarned: false,
      level: 2,
      name: 'ivy',
      description: 'ivy saving us!',
    },
    // Add more badges here
  ];

  return (
    <Grid container style={{
      border: '1.5px solid black', padding: '10px', marginBottom: '10px', display: 'flex',
      width: '95%',
      backgroundColor: "#F5F5F5"

    }}>
      <Grid xs={12} ><h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Badges</h2></Grid>
      <Grid container xs={12} style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', paddingLeft: '10px' }}>
        {badges.map((badge, index) => (
          <BadgeInfo key={index} {...badge} />
        ))}
      </Grid>
    </Grid>
  );
};

const BookDrivesCompletedGraph = () => {
  // Sample data for the graph
  const graphData = [
    { month: 'Jan', completed: 5 },
    { month: 'Feb', completed: 8 },
    { month: 'Mar', completed: 10 },
    // Add more data points here
  ];

  return (
    <div style={{
      border: '1.5px solid black', padding: '10px', marginBottom: '10px', display: 'flex',
      width: '95%', backgroundColor: "#F5F5F5"
    }}>
      <h2 style={{ textAlign: 'left', marginBottom: '10px', paddingRight: '10px' }}>Book Drives Completed</h2>
      {/* Render your graph component using the graphData */}
    </div>
  );
};

const Profile: NextPage<ProfileProps> = ({ error, broadcasts, account, drives }) => {
  const [pfpURL, setpfpURL] = useState<string>((account) ? account.pfpLink : "https://icons.iconarchive.com/icons/pictogrammers/material/512/account-circle-icon.png")
  const states = getStates()
  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    if (!account) return
    // get account info
    let data = await fetch(`/api/volunteeraccounts/${account.email}`, {
      method: "GET"
    }).then((response) => response.json()).then((response) => response.data);

    // set new pfp
    const url = await imagePfpUpload(file)
    setpfpURL(url)
    // delete old pfp
    if (data.pfpLink) await imageDelete(data.pfpLink)
    // throw it back up to the cloud
    data.pfpLink = url
    console.log(url)
    console.log(data)
    const response = await fetch(`/api/volunteeraccounts/${account.email}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }).then((response) => response.json())
    console.log("upload: ", response)

  }
  console.log("Profile Page");
  // if the account is not null, that means that everything is working
  // otherwise render the error message page
  const toggleShowEditProfileModal = (val: boolean) => {
    if (val) editProfileRef?.current?.showModal()
    else editProfileRef?.current?.close()

  }
  const editProfileRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(`${account!.fname} ${account!.lname}`)
  const [location, setLocation] = useState(account!.location)
  const [email, setEmail] = useState(account!.email)
  const [affiliation, setAffiliation] = useState("")
  const [favBook, setFavBook] = useState("")

  if (account) {
    return (
      <Grid>
        <PageContainer broadcasts={broadcasts} fName={account.fname} currPage="profile" />
        <Grid container display="flex" padding={1} sx={{ pl: 20 }} rowSpacing={2}>
          <Grid item xs={12} sm={7} display="flex" flexDirection="column" >
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
                backgroundColor: "#F5F5F5"
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 'auto',
                    width: '50%',
                    height: 'auto',
                  }}
                >
                  <img
                    src={pfpURL}
                    alt="Profile Image"
                    style={{

                    }}
                  />
                  <div>
                    <input accept="image/*" id="icon-button-file"
                      type="file" style={{ display: 'none' }} onChange={changeHandler} />
                    <label htmlFor="icon-button-file">
                      <IconButton color="primary" aria-label="upload picture"
                        component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '65%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingLeft: '4px',
                }}
              >
                <p style={{ fontWeight: 800, fontSize: 30, marginBottom: 2, color: "#5F5F5F" }}>{`${account.fname} ${account.lname}`}</p>
                <p style={{ fontWeight: 500, marginBottom: 2, color: "#5F5F5F" }}>{account.email}</p>
                <p style={{ fontWeight: 500, color: "#5F5F5F" }}>{`# of Bookdrives completed: ${drives!.length}`}</p>
                <p style={{ marginTop: 16, color: "blue", fontWeight: 600, cursor: "pointer" }} onClick={() => toggleShowEditProfileModal(true)}>Edit Profile</p>
              </div>

            </Box>
            <BookDrivesCompletedGraph />
            <BadgeDisplayCase />
            <dialog
              ref={editProfileRef}
              style={{
                height: "70%",
                width: "50%",
                borderRadius: "3%",
                padding: 0,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Grid
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
                alignSelf={"flex-start"}
                height={"100%"}
                sx={{
                  backgroundColor: "#F5F5F5",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent={"space-between"}
                  width="100%"
                  sx={{ marginTop: 1 }}
                >
                  <p
                    style={{
                      color: "#5F5F5F",
                      fontWeight: 600,
                      fontSize: 20,
                      width: "90%",
                      marginLeft: "5%",
                    }}
                  >
                    Edit Profile
                  </p>
                  <p style={{ cursor: "pointer", marginRight: 7, fontWeight: "600" }} onClick={() => toggleShowEditProfileModal(false)}>x</p>

                </Grid>
                <Grid flexDirection="row">
                  <Grid flexDirection="column">
                    <img src={pfpURL} />
                    <Button>Upload new</Button>
                    <Grid flexDirection={"column"} sx={{padding: 2}}>
                      <input type="text" placeholder={"name"} style={{width: "85%"}} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                      <FormControl sx={{ width: 300, border: "2px solid #5F5F5F", borderRadius: 2, backgroundColor: "#F5F5F5", zIndex: 1000 }}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                          onChange={(e: SelectChangeEvent<string>) => setLocation(parseInt(e.target.value))}
                          input={<OutlinedInput label="State" />}
                        >
                          {
                            states.map((state) => (
                              <MenuItem key={state.index} value={state.index} sx={{zIndex: 1000001}}>{state.name}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                      <input type="text" placeholder={"email"} style={{width: "85%"}} value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                    </Grid>
                  </Grid>

                </Grid>
                <TextField
                  multiline
                  autoFocus
                  required
                  placeholder="message"
                  rows={7}
                  sx={{
                    width: "85%",
                    marginBottom: "5px",
                    backgroundColor: "#FFFFFF",
                    color: "#FE9384",
                    borderColor: "#FE9834",
                  }}

                />
                <Grid
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center"
                  sx={{ width: "50%" }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#F3D39A",
                      "&:hover": { backgroundColor: "#D3A874" },
                      fontWeight: 550,
                      color: "#5F5F5F",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#F3D39A",
                      "&:hover": { backgroundColor: "#D3A874" },
                      fontWeight: 550,
                      color: "#5F5F5F",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </dialog>
          </Grid>
          <Grid item xs={12} sm={5} height={"418px"}>
            <Box
              sx={{
                width: "100%",
                height: "110%",
                border: "1.5px solid black",
                '@media (min-width: 600px)': {
                  display: 'inline-block',
                  width: '100%',
                  height: '100%',
                },
                maxWidth: "450px",
                backgroundColor: "#F5F5F5"
              }}>
              <MapComponent drives={drives ? drives : []} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px", flexDirection: "column" }}>
        <h1>{error}</h1>
        {// when the error is not an auth error give them the button to go back
          error !== "You must login before accessing this page" &&
          <Link href="/dash-volunteer">
            <button style={{ width: "50px", height: "50px", borderRadius: "20%" }}>Volunteer Dashboard</button>
          </Link>}
      </div>
    )
  }
}

export const getServerSideProps = async (context: any) => {
  try {
    // get current session and email --> account of current user
    const session = await getServerSession(context.req, context.res, authOptions)
    // if (session) console.log("hiiii")
    if (!session || !session.user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false
        }
      }
    }
    const email = session.user.email

    await dbConnect()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel()
    const volunteerAccount: VolunteerAccount | null = await VolunteerAccount.findOne({ email: email });
    if (!volunteerAccount) throw new Error("Volunteer account not found")
    // findsall completed bookDrives that correspond to the volunteer account
    const promises = volunteerAccount.driveIds.map(async (driveId: string) => await BookDrive.find({ driveCode: driveId, status: BookDriveStatus.Completed }));
    // you have to resolve these promises before continuing
    const resolvedPromises = await Promise.all(promises);
    // you have to flatten the array otherwise it will have a weird shape.
    const drives: BookDrive[] | null = resolvedPromises.flat()
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel();

    console.log(volunteerAccount.broadcasts);
    const bPromises = volunteerAccount.broadcasts.map((broadcastId) => {
      const res = Broadcast.findOne({ id: broadcastId });
      if (!res) console.log("the bad broadcastId is", broadcastId);
      else return res;
    });
    const broadcasts = (await Promise.all(bPromises)) as Broadcast[];
    return { props: { broadcasts: JSON.parse(JSON.stringify(broadcasts)), account: JSON.parse(JSON.stringify(volunteerAccount)) as VolunteerAccount, drives: JSON.parse(JSON.stringify(drives)) as BookDrive[], error: null } }
  } catch (e: Error | any) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return { props: { error: strError, account: null, drives: null } }
  }

}

export default Profile;
