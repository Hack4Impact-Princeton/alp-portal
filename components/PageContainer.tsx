import { Box, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon,  Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InboxIcon from '@mui/icons-material/Inbox';
import Navbar from '../components/Navbar'
import { signOut } from "next-auth/react"
import useDynamicPadding from '../lib/useDynamicPadding';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { Popover, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Broadcast } from "../models/Broadcast";
import FriendRequestCard from '../components/FriendRequestCard';
import FriendRequest from '../components/FriendRequest'; 
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Switch } from '@mui/material';
import { VolunteerAccount } from "../models/VolunteerAccount";
import { getStates } from "../lib/enums";


interface FriendInfo {
  email: string;
  fname: string;
  lname: string;
  state: { name: string; index: number };
  pfp: string;

  // Add or modify properties as needed
}

type PageContainerProps = {
    fName: String;
    userEmail?: string;
    currPage: "dash-volunteer" | "profile" | "instruction-steps" | "h4i-team" | "forum" | "leaderboard" | "profile_search";
    broadcasts ?: Broadcast[];
    friendRequests?: string[];
    allVolunteers?: VolunteerAccount[];
}



const PageContainer: React.FC<PageContainerProps> = ({ fName, userEmail, currPage, broadcasts, friendRequests, allVolunteers }) => {
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
  let friendInfo:FriendInfo[] = []
  const myEmail = userEmail || "";
  const [friendInfoList, setFriendInfoList] =
      useState<FriendInfo[]>([]);
  if (allVolunteers){
    friendInfo = allVolunteers
    .map((account) =>
      reqEmailSet.has(account.email)
        ? {
            email: account.email,
            fname: account.fname,
            lname: account.lname[0],
            state: states.find((state) => state.index === account.location),
            pfp: account.pfpLink,
            // Add or modify properties as needed
          }
        : null
    )
    .filter((item) => item !== null) as FriendInfo[];
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
    useEffect(()=> {      
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
        <Navbar active={currPage}></Navbar>
        <Box sx={{
          float: 'right',
          height: '7vh',
          width: '30.2vw',
          backgroundColor: '#fe9834',
          borderRadius: '5px',
          pt: '5px'
        }}>
          <Grid container flex-direction="row"
            justifyContent="flex-end"
            alignItems="center">
            <Grid xs={4}><h3>Welcome, {fName}</h3></Grid>
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
                <Box p={2}>
                    <Typography variant="h6" sx={{ color: '#fe9834' }}>Inbox</Typography>
                    {/* Add buttons to filter friend requests and broadcasts */}
                    <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        borderRadius: 0,
                        backgroundColor: activeFilter === "all" ? "#F3D39A" : "#F5F5F5",
                        color: "#5F5F5F",
                        mx: 0.5, // Margin on the left and right
                        my: 1, // Margin on the top and bottom
                        fontWeight: activeFilter === "all" ? "bold" : "normal", // Bold when active
                    }}
                    onClick={() => handleFilterClick("all")}
                    >
                    Broadcasts
                    </Button>
                    <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        borderRadius: 0,
                        backgroundColor: activeFilter === "friends" ? "#F3D39A" : "#F5F5F5",
                        color: "#5F5F5F",
                        mx: 0.5, // Margin on the left and right
                        my: 1, // Margin on the top and bottom
                        fontWeight: activeFilter === "friends" ? "bold" : "normal", // Bold when active
                    }}
                    onClick={() => handleFilterClick("friends")}
                    >
                    Friend Requests
                    </Button>
                    {activeFilter === "all" && broadcasts?.map((broadcast, index) => (
                    <Collapse in={visibleBroadcasts[index]} key={index} sx={{ transition: '0.3s' }}>
                        <Box sx={{
                        width: '300px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        border: '1px solid #d89600',
                        padding: '12px',
                        mb: 2, // Add margin-bottom for space
                        }}>
                        <Typography variant="body1" sx={{ cursor: 'pointer', flex: 1 }} onClick={() => handleBroadcastClick(index)}>
                            {broadcast.message}
                        </Typography>
                        </Box>
                    </Collapse>
                    ))}
                        {activeFilter === 'friends' &&
                            friendInfoList.map((request, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <FriendRequestCard
                                key={index}
                                profilePicture={request.pfp}
                                name={request.fname}
                                reqEmail={request.email}
                                state={request.state.name}
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
            <Grid xs={3}><WhiteTextButton variant="text" className="signout" onClick={handleSignOut}> Sign Out </WhiteTextButton></Grid>
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
        <h1 style={{ textAlign: "left", fontSize: fontsize, paddingRight: 10 }}>{pageName}</h1>
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