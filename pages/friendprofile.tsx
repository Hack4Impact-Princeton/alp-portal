import { NextPage,GetServerSideProps } from "next";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import useDynamicPadding from "../lib/useDynamicPadding";
import RecentPostsContainer from "../components/friendpfp/RecentPostsContainer"
import InfoIcon from '@mui/icons-material/Info';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Grid, IconButton, Button, } from "@mui/material";
import getVolunteerAccountModel, { VolunteerAccount,BadgeType } from "../models/VolunteerAccount";
import { useState } from "react";
import MapComponent from "../components/MapComponent";
import { Person } from "@mui/icons-material";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import getPostModel, { Posts } from "../models/Post";



type FriendProfileProps = {
    friendAccount: VolunteerAccount | undefined;
    friendPosts: Posts | undefined
  };

const FriendProfile: NextPage<FriendProfileProps> = ({ friendAccount, friendPosts
}) => {
    
    return (
        <>
        {friendAccount && (
        <Grid>
        <Navbar active="forum" />
            <Grid
            display="flex"
            flexDirection="column"
            container
            sx={{
                pl: useDynamicPadding(635, 775, "29vw", "20vw", "15vw"),
                pt: "5vh",
                pr: "5vw",
                width: "100%",
                justifyContent: "space-between",
            }}
            spacing={2}
            >
                <Grid className="page header" display="flex" flexDirection="row" alignItems={"center"} padding={0}>
                    <img src={friendAccount.pfpLink} style={{borderRadius: "50%", height:"100px",marginRight:"20px"}}/>
                    <Grid display={"flex"} flexDirection={"column"}>
                        <h1 style={{fontSize:"50px", marginBottom:"5px"}}>{friendAccount.fname} {friendAccount.lname}</h1> {/*TODO: UPDATE FIELDS*/}
                        <p style={{fontSize:"20px"}}>AZ | {friendAccount.allDrives} book drives completed</p>
                    </Grid>
                </Grid>
                <Grid className="first body container" display={"flex"} flexDirection="row" border={"1.5px solid black"} padding={0} marginTop={5}>
                    <Grid className="left column" display={"flex"} flexDirection="column" width={"70%"} marginRight={3}>
                        <RecentPostsContainer name={friendAccount.fname}/>
                        <PersonalInfoCard account={friendAccount}/>
                    </Grid>
                    <Grid className="right column" display={"flex"} flexDirection="column" width={"30%"} border={"1.5px solid red"}>

                    </Grid>
                    
                </Grid>
                <BadgeDisplayCase badgeLevels={friendAccount.badges}/>
            </Grid>
        </Grid> )}
        </>
    )
}


const PersonalInfoCard: React.FC<{ account: VolunteerAccount }> = ({ account }) => {
    const affiliation = account.affiliation.length ? <p style={{ display: "inline" }}>{account.affiliation}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your affiliation!</p>
    const hobbies = account.hobbies.length ? <p style={{ display: "inline" }}>{account.hobbies.join(', ')}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your hobbies!</p>
    const faveBook = account.favoriteBook.length ? <p style={{ display: "inline" }}>{account.favoriteBook}</p> : <p style={{ display: "inline", fontStyle: "italic" }}>add your favorite book!</p>
  
    return (
      <div style={{
        border: '1.5px solid #C9C9C9', borderRadius:"5px", padding: '20px', marginBottom: '10px', display: 'flex',
        width: '100%', backgroundColor: "#F5F5F5", flexDirection: "column"
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
  

export default FriendProfile

export const getServerSideProps: GetServerSideProps<FriendProfileProps> = async (context:any) => {
  const { query } = context;
  const receivedData = typeof query.data === 'string' ? JSON.parse(query.data) : null;
  if (!receivedData) {
    return {
      redirect: {
        destination: "../forum",
        permanent: false,
      },
    };
  }
  console.log(receivedData)
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "../auth/login",
        permanent: false,
      },
    };
  }
  const myEmail = session.user?.email

  const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
  const friendAccount: VolunteerAccount = (await VolunteerAccount.findOne({
    _id: receivedData
  })) as VolunteerAccount;
  const Posts: mongoose.Model<Posts> = getPostModel();

  const friendPosts = (await Posts.find({
    email: friendAccount.email }
  )) as Posts[];
  
  return {
    props: {
      friendAccount: JSON.parse(JSON.stringify(friendAccount)) || undefined,
      friendPosts: JSON.parse(JSON.stringify(friendPosts)) || undefined
    },
  };
};