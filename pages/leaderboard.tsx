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

const Leaderboard: NextPage = () => {
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
    const myAccount = allVolunteers.find(
      (obj) => obj.email == session.user?.email
    );
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
