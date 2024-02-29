import Navbar from "../components/Navbar";
import { NextPage } from "next";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import useDynamicPadding from "../lib/useDynamicPadding";
import { authOptions } from "./api/auth/[...nextauth]";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../models/VolunteerAccount";
import getBookDriveModel, { BookDrive } from "../models/BookDrive";
import { getStates } from "../lib/enums";
import LeaderTable from "../components/leaderboard/LeaderTable";
import Podium from "../components/leaderboard/Podium";
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

type objtype = {
  userName: string;
  userState: string;
  totalDrives: number;
  seasonalDrives: number;
};
type LeaderboardProps = {
  leaderboardData: objtype[];
  myLeaderboard: objtype[];
};

const Leaderboard: NextPage<LeaderboardProps> = ({
  leaderboardData,
  myLeaderboard,
}) => {
  const seasonalBoard = leaderboardData.sort(function (a, b) {
    return b.seasonalDrives - a.seasonalDrives;
  });
  const allTimeBoard = leaderboardData.sort(function (a, b) {
    return b.totalDrives - a.totalDrives;
  });
  return (
    <div style={{backgroundColor:"#5F5F5F",height:"100vh",padding:0}}>
      <Navbar active="leaderboard" />
      <Grid2
        display="flex"
        flexDirection="column"
        container
        sx={{
          pl: useDynamicPadding(635, 775, "29vw", "20vw", "13vw"),
          pt: "5vh",
          pr: "5vw",
          width: "100%",
          justifyContent: "space-between",
          backgroundColor:"#5F5F5F"
        }}
        spacing={0}
      >
          <Grid2 display="flex" justifyContent={"center"}>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>

            <h1
              style={{
                color: "white",
                fontSize: 65,
                fontWeight: 600,
                textAlign:"center",
                paddingLeft:15,
                paddingRight:15
              }}
            >
              LEADERBOARD
            </h1>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>
            <StarOutlinedIcon sx={{fontSize: 50, borderColor:"orange", color: "#FE9834"}}/>

          
         </Grid2>

        
        <Grid2 container flexDirection={"row"} justifyContent={"center"}>
          <Grid2 width={"42%"} marginRight={5}>
            <h1 style={{ color: "white",textAlign:"center" }}>This Season</h1>
            <Grid2
              sx={{
                backgroundColor: "#FE9834",
                color: "#F1F1F1",
                padding: 1,
                paddingLeft: 2,
                borderRadius: 1,
                borderWidth:1,
                borderColor: "#F1F1F1",
                margin: 1,
              }}
            >
              <h3 style={{textAlign:"center"}}>
                Me: {myLeaderboard[0] ? myLeaderboard[0].seasonalDrives:0} drives completed this
                season
              </h3>
            </Grid2>
            <Grid2
              sx={{
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Podium data={seasonalBoard} boardType={"seasonal"} />
            </Grid2>
            <LeaderTable data={seasonalBoard} boardType={"seasonal"} />
          </Grid2>
          <Grid2 width={"42%"}>
            <h1 style={{ color: "white", textAlign:"center" }}>Overall</h1>
            <Grid2
              sx={{
                backgroundColor: "#FE9834",
                color: "#F1F1F1",
                padding: 1,
                paddingLeft: 2,
                borderRadius: 1,
                borderColor: "#C9C9C9",
                margin: 1,
              }}
            >
              <h3 style={{textAlign:"center"}}>Me: {myLeaderboard[0] ? myLeaderboard[0].totalDrives: 0} total drives completed</h3>
            </Grid2>
            <Grid2
              sx={{
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Podium data={allTimeBoard} boardType={"all"} />
            </Grid2>

            <LeaderTable data={allTimeBoard} boardType={"all"}  />
          </Grid2>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Leaderboard;
export const getServerSideProps = async (context: any) => {
  try {
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
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const allVolunteers: VolunteerAccount[] = (await VolunteerAccount.find(
      {}
    )) as VolunteerAccount[];
    /*const myAccount = allVolunteers.find(
      (obj) => obj.email == session.user?.email
    );*/
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const allBookDrives: BookDrive[] = (await BookDrive.find(
      {}
    )) as BookDrive[];
    const states = getStates();
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();

    const inSeason = (id: string): boolean => {
      const currDrive = allBookDrives.find((drive) => drive.driveCode == id);
      if (currDrive == null) return false;
      if (currDrive.status == 2) {
        if (currDrive.completedDate.getFullYear() != currYear) {
          return false;
        }
        if (
          (currMonth <= 7 && currDrive.completedDate.getMonth() <= 7) ||
          (currMonth > 7 && currDrive.completedDate.getMonth() > 7)
        )
          return true;
      }
      return false;
    };

    let leaderboardData = [];
    let myLeaderboard = [];
    for (const v of allVolunteers) {
      // if (v.allDrives == 0) continue;
      const userName = v.fname + " " + v.lname[0];
      // const userState = states.find((state) => state.index === v.location);
      const totalDrives = v.allDrives;
      let seasonalDrives = 0;
      for (const d of v.driveIds) {
        if (inSeason(d)) {
          seasonalDrives += 1;
        }
      }
      leaderboardData.push({
        userName: userName,
        // userState: userState ? userState.name : "",
        totalDrives: totalDrives,
        seasonalDrives: seasonalDrives,
      });
      //console.log(leaderboardData);
      if (v.email == session.user?.email) {
        myLeaderboard.push({
          userName: userName,
          // userState: userState ? userState.name : "",
          totalDrives: totalDrives,
          seasonalDrives: seasonalDrives,
        });
        //console.log("myleaderboard", myLeaderboard);
      }
    }
    return {
      props: {
        leaderboardData: leaderboardData,
        myLeaderboard: myLeaderboard,
      },
    };
  } catch (e: Error | any) {
    const errorStr =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;
    return {
      props: { error: errorStr },
    };
  }
};
