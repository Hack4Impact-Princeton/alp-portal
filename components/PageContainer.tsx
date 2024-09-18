import { Box, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InboxIcon from '@mui/icons-material/Inbox';
import Navbar from '../components/Navbar'
import { signOut } from "next-auth/react"
import useDynamicPadding from '../lib/useDynamicPadding';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Popover, Typography,IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Broadcast } from "../models/Broadcast";
import FriendRequestCard from '../components/FriendRequestCard';
import FriendRequest from '../components/FriendRequest';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Switch } from '@mui/material';
import { VolunteerAccount } from "../models/VolunteerAccount";
import { getStates } from "../lib/enums";
import CircularIcon from './CircularIcon';


type PageContainerProps = {
  fName: String;
  userEmail?: string;
  currPage: "dash-volunteer" | "profile" | "instruction-steps" | "h4i-team" | "forum" | "leaderboard" | "profile_search" | "broadcast" | "admin-dashboard";
  broadcasts?: Broadcast[];
  friendRequests?: string[];
  allVolunteers?: VolunteerAccount[];
  admin: boolean | null
}



const PageContainer: React.FC<PageContainerProps> = ({ fName, userEmail, currPage, broadcasts, friendRequests, allVolunteers, admin}) => {
  const leftPaddingValue = useDynamicPadding(635, 775, "29vw", "20vw", "15vw")
  const WhiteTextButton = styled(Button)<ButtonProps>(() => ({
    color: 'white',
  }));
  const InboxIconButton = styled(Button)<ButtonProps>(() => ({
    height: '100%',
    width: '100%',
    borderRadius: '5px',
  }));
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [visibleBroadcasts, setVisibleBroadcasts] = useState(Array(broadcasts?.length).fill(true));
  const [activeFilter, setActiveFilter] = useState("all"); // Added state for the active filter
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  //const [visibleFriendRequests, setVisibleFriendRequests] = useState([...testFriendRequests]);
  // friend request stuff
  const reqEmailSet = new Set(friendRequests);
  const states = getStates();
  let friendInfo: VolunteerAccount[] = []
  const myEmail = userEmail || "";
  const [friendInfoList, setFriendInfoList] =
    useState<VolunteerAccount[]>([]);
  if (allVolunteers) {
    friendInfo = allVolunteers
      .map((account) =>
        reqEmailSet.has(account.email)
          ? account
          : null
      )
      .filter((item) => item !== null) as VolunteerAccount[];
  }

  /*const updateFriendReqs = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email != friendReqEmail)
      );
    }, 200);
  };*/

  const handleOpenPopover = () => {
    setPopoverOpen(true);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleBroadcastClick = (index: number) => {
    // Toggle the visibility of the clicked broadcast message
    const updatedVisibility = [...visibleBroadcasts];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleBroadcasts(updatedVisibility);
  };

  const handleApproveFriendRequest = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email != friendReqEmail)
      );
    }, 200);
    setSnackbarMessage('Friend request has been approved!');
    setSnackbarOpen(true);
  };

  const handleRejectFriendRequest = (friendReqEmail: string) => {
    setTimeout(() => {
      setFriendInfoList(
        friendInfoList.filter((item) => item.email != friendReqEmail)
      );
    }, 200);
    setSnackbarMessage('Friend request has been rejected!');
    setSnackbarOpen(true);
  };

  const handleActionCompleted = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  };


  let pageName = "";
  let fontsize = "";
  switch (currPage) {
    case "dash-volunteer": {
      pageName = "Home";
      fontsize = "90px";
      break;
    }
    case "profile": {
      pageName = "Profile";
      fontsize = "90px";
      break;
    }
    case "instruction-steps": {
      pageName = "Organizer Steps";
      fontsize = "70px";
      break;
    }
    case "h4i-team": {
      pageName = "The Developer Team";
      fontsize = "90px";
      break;
    }
    case "forum": {
      pageName = "Forum";
      fontsize = "90px";
      break;
    }
    case "leaderboard": {
      pageName = "Leaderboard";
      fontsize = "90px";
      break;
    }
    case "profile_search": {
      pageName = "Profile Search";
      fontsize = "90px";
      break;
    }
  }

  const handleSignOut = () => {
    console.log("Signing out user");
    signOut();
    window.location.href = '/';
  }
  useEffect(() => {
    setFriendInfoList(friendInfo);
  }, [])
  useEffect(() => {
    if (snackbarOpen) {
      const timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 6000); // Adjust the duration as needed
      return () => clearTimeout(timeoutId);
    }
  }, [snackbarOpen]);


  return (
    <>
      <Grid>
        <Navbar active={currPage} admin={admin}></Navbar>
        <Box sx={{
          float: 'right',
          height: '10vh',
          minHeight: "65px",
          // maxWidth: '500px',
          width: "fit-content",
          minWidth: "89px",
          backgroundColor: '#fe9834',
          borderRadius: '5px',
          pt: '5px'
        }}>
          <Grid container flex-direction="row"
            justifyContent="flex-end"
            alignItems="center">
            <Grid xs={4} width={"wrap-content"} mr="5px"><h3>Welcome, {fName}</h3></Grid>
            <Grid xs={2}>
              <InboxIconButton color="inherit" onClick={handleOpenPopover}>
                <InboxIcon></InboxIcon>
              </InboxIconButton>
              <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 66.5,
                  horizontal: 'right',
                }}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Box p={2} >
                  <Typography variant="h6" sx={{ color: '#fe9834' }}>Inbox</Typography>
                  {/* Add buttons to filter friend requests and broadcasts */}
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      fontFamily: "Epilogue",
                      '&:hover': {
                        backgroundColor: "#D3A874",
                      },
                      borderRadius: 1,
                      backgroundColor: activeFilter === "all" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      mx: 0.5, // Margin on the left and right
                      my: 1, // Margin on the top and bottom
                      fontWeight: activeFilter === "all" ? "bold" : "normal",
                      textTransform: 'none',
                    }}
                    onClick={() => handleFilterClick("all")}
                  >
                    Broadcasts
                  </Button>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      fontFamily: "Epilogue",
                      '&:hover': {
                        backgroundColor: "#D3A874",
                      },
                      borderRadius: 1,
                      backgroundColor: activeFilter === "friends" ? "#F3D39A" : "#F5F5F5",
                      color: "#5F5F5F",
                      mx: 0.5, // Margin on the left and right
                      my: 1, // Margin on the top and bottom
                      fontWeight: activeFilter === "friends" ? "bold" : "normal", // Bold when active
                      textTransform: 'none'
                    }}
                    onClick={() => handleFilterClick("friends")}
                  >
                    Friend Requests
                  </Button>
                  {/* Add more filters as needed */}
                  {activeFilter === "all" && broadcasts?.map((broadcast, index) => (
                    <Collapse in={visibleBroadcasts[index]} key={index} sx={{ transition: '0.3s' }}>
                      <Box sx={{
                        width: '300px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        padding: '12px',
                        mb: 3,
                        cursor: 'pointer',
                        backgroundColor: '#f2f2f2',
                      }}
                        
                      >
                        
                        <Grid display={"flex"} alignContent={"center"} justifyContent={"space-between"} >
                          <Grid  alignContent={"center"}>
                            <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold', color: '#5F5F5F' }}>{broadcast.subject}</Typography>
                          </Grid>
                          <Grid >
                          <IconButton
                            sx={{  color: "#5F5F5F", margin:"0"}}
                            size={"small"}
                            onClick={() => handleBroadcastClick(index)}
                          >
                            <CloseIcon sx={{fontSize:"20px"}}/>
                          </IconButton>
                          </Grid>
                          
                        </Grid>
                        
                        <Typography variant="body2" sx={{ marginTop:"5px",fontSize: '.9rem', fontWeight: "500", color: '#666', }}><i>{broadcast.senderName}</i></Typography>
                        <Typography variant="body2" sx={{ marginBottom: '4px', fontSize: '0.9rem', color: '#666' }}><i>{formatDate(broadcast.sentTime)}</i></Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#666' }}>{broadcast.message}</Typography>
                      </Box>
                    </Collapse>
                  ))}
                  {activeFilter === 'friends' &&
                    friendInfoList.map((request, index) => (
                      <div key={index} style={{ marginBottom: '10px' }}>
                        <FriendRequestCard
                          key={index}
                          profilePicture={request.pfpLink}
                          name={request.fname}
                          affiliation={request.affiliation}
                          reqEmail={request.email}
                          state={request.state}
                          myEmail={myEmail}
                          requeststate='pending'
                          onApprove={() => handleApproveFriendRequest(request.email)}
                          onReject={() => handleRejectFriendRequest(request.email)}
                          onActionCompleted={handleActionCompleted}
                        />
                      </div>
                    ))}
                </Box>
              </Popover>
            </Grid>
            <Grid xs={3}><WhiteTextButton style={{ fontFamily: 'Epilogue' }} variant="text" className="signout" onClick={handleSignOut}> Sign Out </WhiteTextButton></Grid>
            <Grid xs={2}><img src="/alp-logo.png" alt="alp-logo" height="55px"></img></Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid xs={12} sx={{
        pl: leftPaddingValue,
      }}>
        <Box sx={{
          height: '12vh',
        }}></Box>
        <div style={{ display: "flex", alignItems: "center" }}>

          <h1 style={{ textAlign: "left", fontSize: fontsize, paddingRight: 10, color: "#5F5F5f" }}>{pageName}</h1>
          {/* {pageName === 'Profile' && <div style={{ position: "relative" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
              <circle cx="35.5" cy="35.5" r="35.5" fill="#5F5F5F" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" style={{ position: "absolute", top: 13, left: 15 }}>
              <path d="M39 10.2173C39.0014 9.96066 38.9523 9.70627 38.8552 9.46871C38.7582 9.23114 38.6152 9.01507 38.4345 8.83287L30.1665 0.56549C29.9843 0.384775 29.7682 0.241802 29.5306 0.144768C29.293 0.0477341 29.0386 -0.00145104 28.782 3.25904e-05C28.5254 -0.00145104 28.271 0.0477341 28.0334 0.144768C27.7958 0.241802 27.5797 0.384775 27.3975 0.56549L21.879 6.08358L0.565532 27.3955C0.384803 27.5777 0.241819 27.7938 0.144778 28.0313C0.0477376 28.2689 -0.00145115 28.5233 3.25928e-05 28.7799V37.0473C3.25928e-05 37.5644 0.205478 38.0604 0.571173 38.426C0.936869 38.7917 1.43286 38.9971 1.95003 38.9971H10.218C10.4909 39.012 10.7638 38.9693 11.0191 38.8719C11.2744 38.7745 11.5064 38.6245 11.7 38.4317L32.8965 17.1198L38.4345 11.6992C38.6125 11.5102 38.7575 11.2927 38.8635 11.0557C38.8823 10.9003 38.8823 10.7432 38.8635 10.5877C38.8726 10.497 38.8726 10.4055 38.8635 10.3148L39 10.2173ZM9.41852 35.0974H3.90003V29.5793L23.2635 10.2173L28.782 15.7354L9.41852 35.0974ZM31.5315 12.9861L26.013 7.46797L28.782 4.71868L34.281 10.2173L31.5315 12.9861Z" fill="white" />
            </svg>
          </div>} */}
        </div>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default PageContainer;