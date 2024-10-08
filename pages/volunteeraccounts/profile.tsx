import getVolunteerAccountModel, { VolunteerAccount } from "../../models/VolunteerAccount";
import dbConnect from '../../lib/dbConnect';
import { Grid, IconButton, Button, } from "@mui/material";
import Box from '@mui/material/Box';
import PageContainer from "../../components/PageContainer";
import React, { useState, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import MapComponent from '../../components/MapComponent';
import Link from 'next/link';
import { BookDriveStatus, getStates } from "../../lib/enums";
import getBookDriveModel, { BookDrive } from "../../models/BookDrive";
import { BadgeType } from '../../models/VolunteerAccount';
import { NextPage } from 'next';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import getBroadcastModel, { Broadcast } from "../../models/Broadcast";
import { imageDelete, imagePfpUpload } from "../../db_functions/imageDB";
import InfoIcon from '@mui/icons-material/Info';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import useDynamicPadding from "../../lib/useDynamicPadding";
import Dropdown from "../../components/Dropdown";

type ProfileProps = {
  error: string | null;
  account: VolunteerAccount | null;
  drives: BookDrive[] | null;
  broadcasts: Broadcast[];
  // badgeLevels: BadgeType;
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


const BadgeDisplayCase = ({ badgeLevels }: { badgeLevels: undefined | BadgeType }) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const getBadgeIconsFromLevels = (badgeLevels: BadgeType) => {
    const files = {
      Connector: ["connector 1.png", "connector 2.png", "connector 3.png", "connector 4.png"],
      Leader: ["leader 1.png", "leader 2.png", "leader 3.png", "leader 4.png"],
      Organizer: ["BDO 1.png", "BDO 2.png", "BDO 3.png", "BDO 4.png"],
      Participation: ["maverick 1.png", "maverick 2.png", "maverick 3.png", "maverick 4.png"],
      Profile: ["friend 1.png", "friend 2.png", "friend 3.png", "friend 4.png"],
      Supporter: ["supporter 1.png", "supporter 2.png", "supporter 3.png", "supporter 4.png"],
    };

    return Object.keys(badgeLevels)
      .map((badgeName: string) => {
        const level = badgeLevels[badgeName as keyof typeof badgeLevels];
        if (level === 0) {
          return null;
        }
        return {
          isEarned: true,
          level: level,
          name: badgeName,
          //description: "description",
          icon: files[badgeName as keyof typeof files][level - 1],
        };
      })
      .filter((badge: any) => badge !== null);
  };

  const openBadgeModal = (badgeName: string) => {
    setSelectedBadge(badgeName);
  };

  const closeBadgeModal = () => {
    setSelectedBadge(null);
  };

  return (
    <Grid container style={{
      border: '1.5px solid #C9C9C9', borderRadius:"5px",padding: '20px', marginBottom: '10px', display: 'flex',
      width: '100%',
      backgroundColor: "#F5F5F5"

    }}>

      <Grid xs={12} ><h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Badges</h2></Grid>

      {badgeLevels && getBadgeIconsFromLevels(badgeLevels).map((badge: any, index: number) => (
        <div key={index} onClick={() => openBadgeModal(badge.icon)} style={{ cursor:"pointer",display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', marginTop: "0px" }}>
          <img
            src={`/badges/${badge.icon}`} // TODO could switch this to cloudinary
            alt="Unlocked Badge"
            style={{ width: '150px', height: '150px', marginBottom: '5px' }}
          />
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{badge.name}</p>
            <p style={{ margin: 0, fontSize: '12px' }}>{badge.description}</p>
          </div>
        </div>
      ))}

      <div className="modal-overlay" onClick={closeBadgeModal} style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999', display: selectedBadge ? 'block' : 'none' }}></div>
      <div className="modal" style={{ borderRadius:"5px",position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: '1000', display: selectedBadge ? 'block' : 'none' }}>
        {selectedBadge && (
          <div className="modal-content" style={{ position: 'relative' }}>
            <span className="close" onClick={closeBadgeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize:"40px" }}>&times;</span>
            <img src={`/badges/${selectedBadge}`} alt="Selected Badge" style={{ width: '400px', height: '400px' }} />
          </div>
        )}
      </div>
    </Grid>
  );
};




const PersonalInfoCard: React.FC<{ account: VolunteerAccount }> = ({ account }) => {
  const affiliation = account.affiliation.length ? <p style={{ display: "inline" }}>{account.affiliation}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your affiliation!</p>
  const hobbies = account.hobbies.length ? <p style={{ display: "inline" }}>{account.hobbies.join(', ')}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your hobbies!</p>
  const faveBook = account.favoriteBook.length ? <p style={{ display: "inline" }}>{account.favoriteBook}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your favorite book!</p>

  return (
    <div style={{
      border: '1.5px solid #C9C9C9', borderRadius:"5px", padding: '20px', marginBottom: '10px', display: 'flex',
      width: '98%', backgroundColor: "#F5F5F5", flexDirection: "column"
    }}>
      <h2 style={{ textAlign: 'left', marginBottom: '10px', paddingRight: '10px' }}>Personal Information</h2>
      <div>
        <Grid container alignItems={"center"}>
          <div style={{ paddingLeft: 5, paddingRight: 8 }}>
            <InfoIcon />
          </div>
          <span style={{ display: 'inline' }}><p style={{ fontWeight: 'bold', display: 'inline' }}>Affiliation: </p>{affiliation}</span>
        </Grid>
        <Grid container alignItems={"center"}>
          <div style={{ paddingLeft: 5, paddingRight: 8 }}>
            <SportsBasketballIcon />
          </div>
          <span style={{ display: 'inline' }}><p style={{ fontWeight: 'bold', display: 'inline' }}>Hobbies: </p>{hobbies}</span>
        </Grid>
        <Grid container alignItems={"center"}>
          <div style={{ paddingLeft: 5, paddingRight: 8 }}>
            <AutoStoriesIcon />
          </div>
          <span style={{ display: 'inline' }}><p style={{ fontWeight: 'bold', display: 'inline' }}>Favorite Book: </p>{faveBook}</span>
        </Grid>
      </div>
    </div>
  );
};

const ProfileError: React.FC<{ error: string }> = ({ error }) => {
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

export const ImageUpload: React.FC<{ setpfpURL: Dispatch<SetStateAction<string>>, currAccount: VolunteerAccount }> = ({ setpfpURL, currAccount }) => {
  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    if (!currAccount) return
    // get account info
    let data = await fetch(`/api/volunteeraccounts/${currAccount.email}`, {
      method: "GET"
    }).then((response) => response.json()).then((response) => response.data);

    // set new pfp
    const url = await imagePfpUpload(file)
    setpfpURL(url)
    // delete old pfp
    if (data.pfpLink && data.pfpLink != "https://res.cloudinary.com/alp-portal/image/upload/c_thumb,g_face,h_150,w_150/v3fcorkg5wlesneukfnl") await imageDelete(data.pfpLink)
    // throw it back up to the cloud
    data.pfpLink = url
    console.log(url)
    console.log(data)
    const response = await fetch(`/api/volunteeraccounts/${currAccount.email}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }).then((response) => response.json())
    console.log("upload: ", response)
  }
  return (
    <div>
      <input accept="image/*" id="icon-button-file"
        type="file" style={{ display: 'none' }} onChange={changeHandler} />
      <label htmlFor="icon-button-file">
        <IconButton sx={{
          backgroundColor: "#FE9834",
          "&:hover": { backgroundColor: "#e0771a" },
          width: 110,
          color: "white",
          borderRadius: 1,
          height: 25
        }} aria-label="upload picture"
          component="span">
          <p style={{
            fontSize: 10
          }}>Upload New</p>
        </IconButton>
      </label>
    </div>

  )
}

const Profile: NextPage<ProfileProps> = ({ error, broadcasts, account, drives }) => {
  const [pfpURL, setpfpURL] = useState<string>((account) ? account.pfpLink : "https://icons.iconarchive.com/icons/pictogrammers/material/512/account-circle-icon.png")
  const states = getStates()
  const [currAccount, setCurrAccount] = useState(account)
  if (!currAccount) return <ProfileError error={error!} />
  const badgeLevels = currAccount.badges
  useEffect(() => {
    console.log(currAccount)
  }, [currAccount])
  // if the account is not null, that means that everything is working
  // otherwise render the error message page
  const toggleShowEditProfileModal = (val: boolean) => {
    if (val) {
      setName(`${currAccount.fname} ${currAccount!.lname}`)
      // setLocation(currAccount.state)
      setHobbies(currAccount.hobbies)
      setAffiliation(currAccount.affiliation)
      setFavBook(currAccount.favoriteBook)
      editProfileRef?.current?.showModal()
    }
    else {
      editProfileRef?.current?.close()
      setName(`${currAccount.fname} ${currAccount.lname}`)
      // setLocation(currAccount.state)
      setHobbies(currAccount.hobbies)
      setAffiliation(currAccount.affiliation)
      setFavBook(currAccount.favoriteBook)
    }

  }
  const city = currAccount.city
  const state = currAccount.state
  const country = currAccount.country
  const editProfileRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(`${currAccount.fname} ${currAccount.lname}`)
  // const [currState, setCurrState] = useState(currAccount.state)
  const [affiliation, setAffiliation] = useState(currAccount.affiliation)
  const [favBook, setFavBook] = useState(currAccount.affiliation)
  const [hobbies, setHobbies] = useState(currAccount.hobbies)
  const editProfile = async () => {
    const nameArr = name.trim().split(" ")
    if (nameArr.length < 2) {
      alert("Enter a valid first and last name")
      return
    }
    setHobbies(hobbies.join(", ").trim().split(", "))
    const update = {
      fname: nameArr[0],
      lname: nameArr[nameArr.length - 1],
      // location: location,
      affiliation: affiliation.trim(),
      favoriteBook: favBook.trim(),
      hobbies: hobbies,
    }
    const newAccount: VolunteerAccount = {
      ...currAccount,
      ...update,
    }
    const res = await fetch(`/api/volunteeraccounts/${currAccount.email}`, {
      method: "PATCH",
      body: JSON.stringify(update)
    })
    if (!res.ok) {
      alert("profile modification failed")
      return
    }
    setCurrAccount(newAccount)
    toggleShowEditProfileModal(false)

  }
  return (
    <Grid>
      <PageContainer broadcasts={broadcasts} fName={currAccount.fname} currPage="profile" admin={currAccount.admin}/>
      <Grid container display="flex" padding={1} sx={{ pl: useDynamicPadding(635, 775, "29vw", "20vw", "15vw"), width: "95%" }} rowSpacing={.5}>
        <Grid item xs={12} sm={12} md={12} lg={9} display="flex" flexDirection="column" >
          <Box
            sx={{
              width: "98%",
              height: "175px",
              border: '1.5px solid #C9C9C9',
              borderRadius: "5px",
              display: 'flex',
              marginBottom: '10px',
              '@media (min-width: 600px)': {
                display: 'flex',
                width: '98%',
              },
              backgroundColor: "#F5F5F5"
            }}
          >
            <div
              style={{
                width: '25%',
                display: 'flex',
                justifyContent: 'center',
                paddingRight:"70px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: 'auto',
                  width: '50%',
                  height: '100%',
                  padding: 2,
                }}
              >
                <Box sx={{
                  '@media (min-width: 760px)': {
                    height: "85%",
                    width: "85%",
                  },
                  height: "50%",
                  display: "flex",
                }}>

                  <img
                    src={pfpURL}
                    alt="Profile Image"
                    style={{
                      // height: "65%",
                      aspectRatio: 1,
                      // flexShrink: 1.5,
                      height: "95%",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                {/* <ImageUpload setpfpURL={setpfpURL} currAccount={currAccount} /> */}
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
              <Grid display="flex" alignItems={"center"}>
                <p style={{ fontWeight: 800, fontSize: 30, marginBottom: 2, color: "#5F5F5F" }}>{`${currAccount.fname} ${currAccount.lname}`}</p>
                {currAccount.admin && ( <p style={{ fontWeight: 800, fontSize: 25, marginBottom: 2, color: "#FE9834", marginLeft:10 }}>Admin</p>)}
              </Grid>
              <p style={{ fontWeight: 500, marginBottom: 2, color: "#5F5F5F" }}>{currAccount.email}</p>
              <p style={{ fontWeight: 500, color: "#5F5F5F" }}>{`# of Bookdrives completed: ${drives!.length}`}</p>
              <p style={{ marginTop: 16, color: "#FE9834", fontWeight: 600, cursor: "pointer" }} onClick={() => toggleShowEditProfileModal(true)}>Edit Profile</p>
            </div>

          </Box>
          <PersonalInfoCard account={currAccount} />
          <dialog
            ref={editProfileRef}
            style={{
              height: "69%",
              width: "40%",
              minWidth: "390px",
              minHeight: "420px",
              borderRadius: "3%",
              padding: 0,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#f5f5f5"
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
              padding={2}
            >
              <Grid
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"space-between"}
                width="100%"
                sx={{ marginTop: 2,marginBottom:2 }}
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
                <p style={{ cursor: "pointer", marginRight: 16, fontWeight: "600" }} onClick={() => toggleShowEditProfileModal(false)}>x</p>

              </Grid>
              <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "row", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "start", width: "30%" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", marginLeft: "12%" }}>
                    <img src={pfpURL} style={{ height: 110, aspectRatio: 1, marginBottom: 2 }} />
                    <ImageUpload setpfpURL={setpfpURL} currAccount={currAccount} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: "67%", flexShrink: 3, height: "100%", paddingTop:1, alignItems: "start", }}>
                  <i style={{ marginLeft: 1, display: "flex", alignSelf: "flex-start", fontSize: 10, marginBottom:5 }}>Name</i>
                  <input type="text" placeholder={"name"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                  <i style={{ marginLeft: 1, display: "flex", alignSelf: "flex-start", fontSize: 10,marginBottom:5,marginTop:10 }}>City, State</i>
                  <p>{city}, {state}</p>
                  <i style={{ marginLeft: 1, display: "flex", alignSelf: "flex-start", fontSize: 10,marginBottom:5,marginTop:10 }}>Country</i>
                  <p>{country}</p>
                  {/* <Dropdown options={states} setResult={setCurrState} location={location} />  */}
                </div>
              </div>
              <div style={{ display: "flex", flex: 1, paddingTop: 10, paddingBottom: 5, justifyContent: "space-around", flexDirection: "column", width: "100%", alignItems: "start", paddingLeft: "4%" }}>
                <i style={{ marginLeft: 3, fontSize: 10 }}>Affiliation</i>
                <input style={{ padding: 3, width: "96%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAffiliation(e.target.value)} value={affiliation} />
                <i style={{ marginLeft: 3, fontSize: 10 }}>Hobbies</i>
                <input style={{ padding: 3, width: "96%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHobbies(e.target.value.split(", "))} value={hobbies.join(", ")} />
                <i style={{ marginLeft: 3, fontSize: 10 }}>Favorite Book</i>
                <input style={{ padding: 3, width: "96%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFavBook(e.target.value)} value={favBook} />
              </div>
              <Grid
                display="flex"
                flexDirection="column"
                justifyContent="space-around"
                alignItems="center"
                height="wrap-content"
                sx={{ width: "100%", padding: 1, }}
              >
                <Button
                  sx={{
                    backgroundColor: "#FE9834",
                    "&:hover": { backgroundColor: "#D87800" },
                    fontWeight: 550,
                    color: "white",
                    width: "95%",
                    marginBottom: 1,
                    fontFamily:"Epilogue"
                  }}
                  onClick={editProfile}
                >
                  Submit
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#5F5F5F",
                    "&:hover": { backgroundColor: "#777777" },
                    fontWeight: 550,
                    color: "white",
                    width: "95%",
                    fontFamily:"Epilogue"
                  }}
                  onClick={() => toggleShowEditProfileModal(false)}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </dialog>
        </Grid>
        <Grid item xs={12} sm={10} md={5} lg={3} height={"302px"} mb={5}>
          <Box
            sx={{
              width: "100%",
              height: "115%",
              border: "1.5px solid #C9C9C9",
              borderRadius:"5px",
              paddingTop:"20px",
              // '@media (min-width: 600px)': {
              //   display: 'inline-block',
              //   width: '100%',
              //   height: '100%',
              // },
              // maxWidth: "300px",
              marginBottom: 150,
              backgroundColor: "#F5F5F5"
            }}>
            <MapComponent drives={drives ? drives : []} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BadgeDisplayCase badgeLevels={badgeLevels ? badgeLevels : undefined} />
        </Grid>
      </Grid>
    </Grid>
  )

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



    return {
      props:
      {
        broadcasts: JSON.parse(JSON.stringify(broadcasts)),
        account: JSON.parse(JSON.stringify(volunteerAccount)) as VolunteerAccount, drives: JSON.parse(JSON.stringify(drives)) as BookDrive[], error: null
      }
    }
  } catch (e: Error | any) {
    console.error(e)
    // if the specific error message occurs it's because the user has not logged in
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`

    return {
      props: {
        error: strError,
        account: null,
        drives: null,
      }
    }
  }
}

export default Profile;
