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
import getChatModel, { Chat } from "../models/Chat";
import ChatList from "../components/forum/ChatList";
import { generateChatInfo } from "../db_functions/chat";
import NewPost from "../components/forum/NewPost";

type PostProps = {
  allPosts: Posts[];
  friendsPosts: Posts[];
  myPosts: Posts[];
  chatInfo: { chat: Chat, otherUser: VolunteerAccount }[];
  account: VolunteerAccount,
  username: string;
  email: string;
};

const Forum: NextPage<PostProps> = ({
  allPosts,
  friendsPosts,
  myPosts,
  username,
  email,
  chatInfo,
  account
}) => {


  const [active, setActive] = useState("friends");
  const [myPostsList, setmyPostsList] = useState<Posts[]>(myPosts);
  const [allPostsList, setallPostsList] = useState<Posts[]>(allPosts);
  const addPost = (myPost: Posts) => {
    if (!myPostsList.includes(myPost))
      setmyPostsList((prevPosts) => {
        return [myPost, ...prevPosts];
      });
    if (!allPostsList.includes(myPost))
      setallPostsList((prevPosts) => {
        return [myPost, ...prevPosts];
      });
  };

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
              <Grid2
                container
                flexDirection={"row"}
                alignItems={"center"}
                sx={{ marginBottom: 2 }}
              >
                <h1 style={{ color: "#FE9834", marginRight: 10 }}>Posts</h1>
                <NewPost username={username} email={email} addPost={addPost} />
              </Grid2>

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
                {active == "friends" &&
                  friendsPosts.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer post={post} />
                      </div>
                    );
                  })}

                {active == "all" &&
                  allPostsList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer post={post} />
                      </div>
                    );
                  })}
                {active == "my" &&
                  myPostsList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer post={post} />
                      </div>
                    );
                  })}
              </Grid2>
            </Grid2>
            <Grid2 sx={{ width: "25vw" }}>
              <h1 style={{ color: "#FE9834" }}>Friends</h1>
              <ChatList chatInfo={chatInfo} user={account} />
              {/* <FriendList /> */}
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
    //const name = account.fname + " " + account.lname;
    //console.log("account", account);
    // console.log("account email", account.email);
    const friendList = account.friends;

    const userName = account.fname + " " + account.lname;
    console.log(userName);
    const volunteerEmail = account.email;
    console.log(volunteerEmail);
    console.log("friendslist", friendList);

    const Posts: mongoose.Model<Posts> = getPostModel();

    const allPosts = (await Posts.find()) as Posts[];
    // console.log("posts", allPosts);
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

    console.log("friends posts", friendsPosts);
    console.log("my posts", myPosts);

    const chatInfo = await generateChatInfo(account)

    return {
      props: {
        friendsPosts: JSON.parse(JSON.stringify(friendsPosts)),
        allPosts: JSON.parse(JSON.stringify(allPosts)),
        myPosts: JSON.parse(JSON.stringify(myPosts)),
        chatInfo: JSON.parse(JSON.stringify(chatInfo)),
        account: JSON.parse(JSON.stringify(account)),
        username: userName,
        email: volunteerEmail,
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
