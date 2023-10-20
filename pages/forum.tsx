import { NextPage } from "next";
import Navbar from "../components/Navbar";
import SearchBar from "../components/forum/SearchBar";
import Box from "@mui/material/Box";
import PageContainer from "../components/PageContainer";
import DriveCard from "../components/DriveCard";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import useDynamicPadding from "../lib/useDynamicPadding";
import { useState } from "react";
import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import PostContainer from "../components/forum/PostContainer";
import getPostModel, { Posts } from "../models/Post";
import { authOptions } from "./api/auth/[...nextauth]";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import getBroadcastModel from "../models/Broadcast";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../models/VolunteerAccount";
import FriendList from "../components/forum/FriendList";

type PostProps = {
  title: string;
  post_id: number;
  alp_id: string;
  date: string;
  text: string;
  upvotes: string[];
  downvotes: string[];
  allPosts: Posts[];
  friendsPosts: Posts[];
  myPosts: Posts[];
};

const Forum: NextPage<PostProps> = ({
  title,
  post_id,
  alp_id,
  date,
  text,
  upvotes,
  downvotes,
}) => {
  const [active, setActive] = useState("friends");
  return (
    <div>
      <Grid2>
        <Navbar active="forum" />
        {/* Necessary box for padding the page body, no overlap with Navbar */}
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
              FORUM
            </h1>
          </Grid2>
          <Grid2 sx={{ justifyContent: "left" }}>
            <SearchBar />
          </Grid2>
          <Grid2 container flexDirection="row" spacing={4}>
            <Grid2 sx={{ width: "50vw" }}>
              <h1 style={{ color: "#FE9834" }}>Posts</h1>
              <Grid2
                className="button-container"
                container
                flexDirection="row"
                spacing={3}
              >
                <Grid2>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 0,
                      backgroundColor:
                        active === "friends" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                    }}
                    onClick={() => setActive("friends")}
                  >
                    Friend's posts
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 0,
                      backgroundColor: active === "all" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                    }}
                    onClick={() => setActive("all")}
                  >
                    All posts
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 0,
                      backgroundColor: active === "my" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                    }}
                    onClick={() => setActive("my")}
                  >
                    My posts
                  </Button>
                </Grid2>
              </Grid2>
              <Grid2
                className="posts-container"
                container
                flexDirection={"column"}
              >
                {active == "friends" && (
                  <div style={{ width: "85%", marginTop: 10 }}>
                    <PostContainer />
                  </div>
                )}
                {active == "all" && <p>all posts</p>}
                {active == "my" && <p>my posts</p>}
              </Grid2>
            </Grid2>
            <Grid2 sx={{ width: "25vw" }}>
              <h1 style={{ color: "#FE9834" }}>Friends</h1>
              <FriendList />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Forum;

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
    const account: VolunteerAccount = (await VolunteerAccount.findOne({
      email: session.user?.email,
    })) as VolunteerAccount;
    const friendList = account.friends;

    const Posts: mongoose.Model<Posts> = getPostModel();

    const allPosts = await Posts.find();
    let friendsPosts: Posts[] = [];
    let myPosts: Posts[] = [];

    allPosts.forEach((p) => {
      friendList.forEach((f) => {
        if (f === p.email) {
          friendsPosts.push(p);
        }
      });
      if (p.email === account.email) {
        myPosts.push(p);
      }
    });

    return {
      props: {
        friendsPosts: friendsPosts,
        allPosts: allPosts,
        myPosts: myPosts,
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
