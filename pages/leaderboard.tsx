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
import { NumberLiteralType } from "typescript";

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
  return (
    <div>
      <Navbar active="leaderboard" />
      <Grid2
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
        <Grid2>
          <h1
            style={{
              color: "#5F5F5F",
              fontSize: 70,
              fontWeight: 600,
            }}
          >
            LEADERBOARD
          </h1>
        </Grid2>
        <Grid2 container flexDirection={"row"}>
          <Grid2 width={"40%"}>
            <h1 style={{ color: "#FE9834", marginLeft: 3 }}>This Season</h1>
            <Grid2
              sx={{
                backgroundColor: "#F3D39A",
                color: "#5F5F5F",
                padding: 1,
                paddingLeft: 2,
                borderRadius: 1,
                borderColor: "#C9C9C9",
                margin: 1,
              }}
            >
              <h3>
                Me: {myLeaderboard[0].seasonalDrives} drives completed this
                season
              </h3>
            </Grid2>
            <LeaderTable data={leaderboardData} boardType={"seasonal"} />
          </Grid2>
          <Grid2 width={"40%"}>
            <h1 style={{ color: "#FE9834", marginLeft: 3 }}>Overall</h1>
            <Grid2>
              <h3>Me: {myLeaderboard[0].totalDrives} drives completed</h3>
            </Grid2>
            <LeaderTable data={leaderboardData} boardType={"all"} />
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
      if (v.allDrives == 0) continue;
      const userName = v.fname + " " + v.lname[0];
      const userState = states.find((state) => state.index === v.location);
      const totalDrives = v.allDrives;
      let seasonalDrives = 0;
      for (const d of v.driveIds) {
        if (inSeason(d)) {
          seasonalDrives += 1;
        }
      }
      leaderboardData.push({
        userName: userName,
        userState: userState ? userState.name : "",
        totalDrives: totalDrives,
        seasonalDrives: seasonalDrives,
      });
      //console.log(leaderboardData);
      if (v.email == session.user?.email) {
        myLeaderboard.push({
          userName: userName,
          userState: userState ? userState.name : "",
          totalDrives: totalDrives,
          seasonalDrives: seasonalDrives,
        });
        console.log("myleaderboard", myLeaderboard);
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
