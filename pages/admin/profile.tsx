import getVolunteerAccountModel, {
  AdminAccount,
} from "../../models/AdminAccount";
import dbConnect from "../../lib/dbConnect";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import PageContainer from "../../components/AdminPageContainer";
import { useState } from "react";
import { signOut } from "next-auth/react";
import MapComponent from "../../components/MapComponent";
import Link from "next/link";
import { BookDriveStatus } from "../../lib/enums";
import getBookDriveModel, { BookDrive } from "../../models/BookDrive";
import { NextPage } from "next";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
//import DriveChart from "../../components/DriveChart";

type ProfileProps = {
  error: string | null;
  account: AdminAccount | null;
  drives: BookDrive[] | null;
};

const BookDrivesCompletedGraph = () => {
  return (
    <div
      style={{
        border: "1.5px solid black",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        width: "95%",
        backgroundColor: "#F5F5F5",
        height: "175px",
      }}
    >
      <h2
        style={{
          textAlign: "left",
          marginBottom: "10px",
          paddingRight: "10px",
        }}
      >
        Book Drives Completed
      </h2>
    </div>
  );
};

const Profile: NextPage<ProfileProps> = ({ error, account, drives }) => {
  console.log("Profile Page");
  // if the account is not null, that means that everything is working
  // otherwise render the error message page
  if (account) {
    console.log("ACCOUNT: ", account);
    return (
      <Grid>
        <PageContainer fName={account.fname} currPage="directory" />
        <Grid
          container
          display="flex"
          padding={1}
          sx={{ pl: 20 }}
          rowSpacing={2}
        >
          <Grid item xs={12} sm={7} display="flex" flexDirection="column">
            <Box
              sx={{
                width: "100%",
                height: "175px",
                border: "1.5px solid black",
                display: "flex",
                marginBottom: "10px",
                "@media (min-width: 600px)": {
                  display: "flex",
                  width: "95%",
                },
                backgroundColor: "#F5F5F5",
              }}
            >
              <div
                style={{
                  width: "35%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                  alt="Profile Image"
                  style={{
                    borderRadius: "auto",
                    width: "50%",
                    height: "auto",
                  }}
                />
              </div>

              <div
                style={{
                  width: "65%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: "4px",
                }}
              >
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 30,
                    marginBottom: 2,
                    color: "#5F5F5F",
                  }}
                >{`${account.fname} ${account.lname}`}</p>
                <p
                  style={{ fontWeight: 500, marginBottom: 2, color: "#5F5F5F" }}
                >
                  {account.email}
                </p>
                <p
                  style={{ fontWeight: 500, color: "#5F5F5F" }}
                >{`# of Bookdrives completed: ${drives!.length}`}</p>
              </div>
            </Box>
            <BookDrivesCompletedGraph />
          </Grid>
          <Grid item xs={12} sm={5} height={"418px"}>
            <Box
              sx={{
                width: "100x`%",
                height: "110%",
                border: "1.5px solid black",
                "@media (min-width: 600px)": {
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                },
                maxWidth: "450px",
                backgroundColor: "#F5F5F5",
              }}
            >
              <MapComponent drives={drives ? drives : []} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "100px",
          flexDirection: "column",
        }}
      >
        <h1>{error}</h1>
        {
          // when the error is not an auth error give them the button to go back
          error !== "You must login before accessing this page" && (
            <Link href="/dash-volunteer">
              <button
                style={{ width: "50px", height: "50px", borderRadius: "20%" }}
              >
                Volunteer Dashboard
              </button>
            </Link>
          )
        }
      </div>
    );
  }
};

export const getServerSideProps = async (context: any) => {
  try {
    // get current session and email --> account of current user
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    // if (session) console.log("hiiii")
    if (!session || !session.user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    const email = session.user.email;
    await dbConnect();
    const AdminAccount: mongoose.Model<AdminAccount> =
      getVolunteerAccountModel();
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const volunteerAccount: AdminAccount | null = await AdminAccount.findOne({
      email: email,
    });

    // findsall completed bookDrives that correspond to the volunteer account
    const promises = volunteerAccount!.driveIds.map(
      async (driveId: string) =>
        await BookDrive.find({
          driveCode: driveId,
          status: BookDriveStatus.Completed,
        })
    );
    // you have to resolve these promises before continuing
    const resolvedPromises = await Promise.all(promises);
    // you have to flatten the array otherwise it will have a weird shape.
    const drives: BookDrive[] | null = resolvedPromises.flat();

    return {
      props: {
        account: JSON.parse(JSON.stringify(volunteerAccount)) as AdminAccount,
        drives: JSON.parse(JSON.stringify(drives)) as BookDrive,
        error: null,
      },
    };
  } catch (e: Error | any) {
    console.error(e);
    // if the specific error message occurs it's because the user has not logged in
    let strError =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;

    return { props: { error: strError, account: null, drives: null } };
  }
};

export default Profile;
