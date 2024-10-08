import { NextPage } from "next";
import Navbar from "../components/Navbar";
import SearchBar from "../components/forum/SearchBar";

import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import useDynamicPadding from "../lib/useDynamicPadding";
import { useState } from "react";
import PostContainer from "../components/forum/PostContainer";
import getPostModel, { Posts } from "../models/Post";
import { authOptions } from "./api/auth/[...nextauth]";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../models/VolunteerAccount";
import { useRouter } from "next/router";
import getChatModel, { Chat } from "../models/Chat";
import ChatList from "../components/forum/ChatList";
import { generateChatInfo } from "../db_functions/chat";
import NewPost from "../components/forum/NewPost";
import UpCaret from "../components/UpCaret";
import DownCaret from "../components/DownCaret";
import RequestList from "../components/forum/RequestList";
import FriendsList from "../components/forum/FriendsList";

import { use } from "chai";

type PostProps = {
  allPosts: Posts[];
  friendsPosts: Posts[];
  myPosts: Posts[];
  flaggedPosts:Posts[];
  chatInfo: { chat: Chat; otherUser: VolunteerAccount }[];
  account: VolunteerAccount;
  username: string;
  email: string;
  friendRequests: string[];
  allVolunteers: VolunteerAccount[];
  refreshPosts: (post_id: string) => void;
};

const Forum: NextPage<PostProps> = ({
  allPosts,
  friendsPosts,
  myPosts,
  flaggedPosts,
  username,
  email,
  chatInfo,
  account,
  friendRequests,
  allVolunteers,
}) => {
  const [active, setActive] = useState("friends");
  const [friendBtn, setFriendBtn] = useState("requests");

  const [myPostsList, setmyPostsList] = useState<Posts[]>(myPosts);
  const [allPostsList, setallPostsList] = useState<Posts[]>(allPosts);
  const [friendPostList, setfriendPostsList] = useState<Posts[]>(friendsPosts);
  const [flaggedPostList, setflaggedPostsList] = useState<Posts[]>(flaggedPosts);

  
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  const refreshData = (post_id: string, flagged?: boolean) => {
    if (flagged){
      // const flaggedPost = allPostsList.find((post)=>post.post_id == post_id)
      // if (flaggedPost) {setflaggedPostsList([...flaggedPostList,flaggedPost])}
      setfriendPostsList(friendPostList.filter((post) => post.post_id !== post_id));
      setallPostsList(allPostsList.filter((post) => post.post_id !== post_id));
    }
    else {
      setmyPostsList(myPostsList.filter((post) => post.post_id !== post_id));
      setallPostsList(allPostsList.filter((post) => post.post_id !== post_id));
    }
  };

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
        <Navbar active="forum" admin={account.admin}/>
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
                sx={{ marginBottom: 1.5 }}
              >
                <h1 style={{ color: "#FE9834", marginRight: 10 }}>Posts</h1>
                <NewPost pfpLink = {account.pfpLink} username={username} email={email} addPost={addPost} />
              </Grid2>

              <Grid2
                className="button-container"
                container
                flexDirection="row"
                spacing={3}
               
              >
                <Grid2  marginBottom={1}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 1,
                      backgroundColor:
                        active === "friends" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      fontFamily:"Epilogue",
                      outline:"none",
                      fontSize:"100%",
                      fontWeight:"bold",
                      '&:hover': {
                        backgroundColor:"#D3A874", 
                      },
                      textTransform:"none",                      
                    }}
                    onClick={() => setActive("friends")}
                  >
                    Friend's Posts
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 1,
                      backgroundColor:
                        active === "all" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      fontFamily:"Epilogue",
                      outline:"none",
                      fontSize:"100%",
                      fontWeight:"bold",
                      '&:hover': {
                        backgroundColor:"#D3A874", 
                      },
                      textTransform:"none",
                    }}
                    onClick={() => setActive("all")}
                  >
                    All Posts
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 1,
                      backgroundColor:
                        active === "my" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      fontFamily:"Epilogue",
                      outline:"none",
                      fontSize:"100%",
                      fontWeight:"bold",
                      '&:hover': {
                        backgroundColor:"#D3A874", 
                      },
                      textTransform:"none",       
                    }}
                    onClick={() => setActive("my")}
                  >
                    My Posts
                  </Button>
                </Grid2>
                {account.admin && (<Grid2  marginBottom={1}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: 1,
                      backgroundColor:
                        active === "flagged" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      fontFamily:"Epilogue",
                      outline:"none",
                      fontSize:"100%",
                      fontWeight:"bold",
                      '&:hover': {
                        backgroundColor:"#D3A874", 
                      },
                      textTransform:"none",                      
                    }}
                    onClick={() => setActive("flagged")}
                  >
                    Flagged Posts
                  </Button>
                </Grid2>)}
              </Grid2>
              <Grid2
                className="posts-container"
                container
                flexDirection={"column"}
              >
                {active == "friends" &&
                  friendPostList &&
                  friendPostList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer
                          post={post}
                          user={account}
                          isOwner={false}
                          refreshPosts={refreshData}
                          email={email}
                          username={username}
                        />
                      </div>
                    );
                  })}

                {active == "all" && allPostsList &&
                  allPostsList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer
                          post={post}
                          user={account}
                          isOwner={false}
                          refreshPosts={refreshData}
                          username={username}
                          email={email}
                        />
                      </div>
                    );
                  })}
                {active == "my" && myPostsList&&
                  myPostsList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer
                          post={post}
                          user={account}
                          isOwner={true}
                          refreshPosts={refreshData}
                          username={username}
                          email={email}
                        />
                      </div>
                    );
                  })}
                  {active == "flagged" && flaggedPostList && 
                  flaggedPostList.map((post) => {
                    return (
                      <div style={{ width: "85%", marginTop: 10 }}>
                        <PostContainer
                          post={post}
                          user={account}
                          isOwner={true}
                          refreshPosts={refreshData}
                          username={username}
                          email={email}
                        />
                      </div>
                    );
                  })}
              </Grid2>
            </Grid2>
            <Grid2 sx={{ width: "27vw", pt: 3 }}>
              <Grid2>
                <h1 style={{ color: "#FE9834" }}>Friends</h1>
              </Grid2>
              <Grid2 sx={{ marginTop: 2 }} marginBottom={2}>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: 1,
                    backgroundColor:
                      friendBtn === "friends" ? "#F3D39A" : "#F5F5F5",
                    color: "#5F5F5F",
                    mr: 2,
                    fontFamily:"Epilogue",
                    outline:"none",
                    fontSize:"100%",
                    fontWeight:"bold",
                    '&:hover': {
                      backgroundColor:"#D3A874", 
                    },
                    textTransform:"none",       
                  }}
                  onClick={() => setFriendBtn("friends")}
                >
                  Friends
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: 1,
                    backgroundColor:
                      friendBtn === "requests" ? "#F3D39A" : "#F5F5F5",
                    color: "#5F5F5F",
                    fontFamily:"Epilogue",
                    outline:"none",
                    fontSize:"100%",
                    fontWeight:"bold",
                    '&:hover': {
                      backgroundColor:"#D3A874", 
                    },
                    textTransform:"none",    
                  }}
                  onClick={() => setFriendBtn("requests")}
                >
                  Requests
                </Button>
              </Grid2>
              <Grid2 sx={{ marginTop: 1 }}>
                {friendBtn == "friends" && (
                  <div>
                    <FriendsList
                      myFriends={account.friends}
                      myEmail={email}
                      allVolunteers={allVolunteers}
                      myAccount={account}
                    />
                  </div>
                )}
                {friendBtn == "requests" && (
                  <div>
                    <RequestList
                      friendRequests={friendRequests}
                      myEmail={email}
                      allVolunteers={allVolunteers}
                    />
                  </div>
                )}
              </Grid2>
              <div style={{ display: "flex", flexDirection: "column", position: "fixed", bottom: showChat ? 0 : -7, right: 20, zIndex: 200, cursor: "pointer" }} >
                <ChatList chatInfo={chatInfo} user={account} showChat={showChat} setShowChat={setShowChat} />
              </div>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </div >
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
    const allVolunteers: VolunteerAccount[] = (await VolunteerAccount.find(
      {}
    )) as VolunteerAccount[];
    const account: VolunteerAccount = allVolunteers.find(
      (volunteer) => volunteer.email === session.user?.email
    ) as VolunteerAccount;
    /*const account: VolunteerAccount = (await VolunteerAccount.findOne({
      email: session.user?.email,
    })) as VolunteerAccount;*/
    //const name = account.fname + " " + account.lname;
    //console.log("account", account);
    // console.log("account email", account.email);
    const friendList = account.friends;

    const userName = account.fname + " " + account.lname;
    const volunteerEmail = account.email;
   
    const Posts: mongoose.Model<Posts> = getPostModel();

    let pPosts = (await Posts.find()) as Posts[];
    pPosts = pPosts.reverse();


    // console.log("posts", allPosts);
    let friendsPosts: Posts[] = [];
    let myPosts: Posts[] = [];
    let publicPosts: Posts[] = [];
    let flaggedPosts: Posts[]=[];

    pPosts.forEach((p) => {
      if (p.flagged) {
        flaggedPosts.push(p)
      }
      else {
        publicPosts.push(p)
      }
      if (p.email === account.email) {
        myPosts.push(p);
      }
      
      friendList.forEach((f) => {
        if (f === p.email && !p.flagged) {
          friendsPosts.push(p);
        }
      });
      
    });

    const filteredPublicPosts = publicPosts.filter(post => 
                    post.is_public 
                    || post.is_public === undefined
                    || post.email === account.email
                   )

    console.log("friends posts", friendsPosts);
    console.log("my posts", myPosts);

    const chatInfo = await generateChatInfo(account);
    return {
      props: {
        friendsPosts: JSON.parse(JSON.stringify(friendsPosts)),
        allPosts: JSON.parse(JSON.stringify(filteredPublicPosts)),
        myPosts: JSON.parse(JSON.stringify(myPosts)),
        flaggedPosts: JSON.parse(JSON.stringify(flaggedPosts)),
        chatInfo: JSON.parse(JSON.stringify(chatInfo)),
        account: JSON.parse(JSON.stringify(account)),
        username: userName,
        email: volunteerEmail,
        friendRequests: JSON.parse(JSON.stringify(account.friendRequests)),
        allVolunteers: JSON.parse(JSON.stringify(allVolunteers)),
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
