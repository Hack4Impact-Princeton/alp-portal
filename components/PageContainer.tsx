import { Box, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InboxIcon from '@mui/icons-material/Inbox';
import Navbar from '../components/Navbar'
import { signOut } from "next-auth/react"
import useDynamicPadding from '../lib/useDynamicPadding';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React from 'react';
import { Popover, Typography } from '@mui/material';


type PageContainerProps = {
    fName: String;
    currPage: "dash-volunteer" | "profile" | "instruction-steps" | "h4i-team" | "forum" | "leaderboard";
}

const PageContainer: React.FC<PageContainerProps> = ({fName, currPage}) => {
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
    const handleOpenPopover = () => {
  setPopoverOpen(true);
};

      const broadcasts = [
    { message: 'Broadcast 1' },
    { message: 'Broadcast 2' },
    { message: 'Broadcast 3' },
  ];

    const handleClosePopover = () => {
        setPopoverOpen(false);
    };




    let pageName = "";
    let fontsize="";
    switch(currPage) {
        case "dash-volunteer": {
            pageName="Home"; 
            fontsize="90px";
            break;
        }
        case "profile": {
            pageName="Profile";
            fontsize="90px";
            break;
        }
        case "instruction-steps": {
            pageName="Organizer Steps";
            fontsize="70px";
            break;
        }
        case "h4i-team": {
            pageName="The Developer Team";
            fontsize="90px";
            break;
        }
        case "forum": {
            pageName="Forum";
            fontsize="90px";
            break;
        }
        case "leaderboard": {
            pageName="Leaderboard";
            fontsize="90px";
            break;
        }
    }

    const handleSignOut = () => {
        console.log("Signing out user");
        signOut();
        window.location.href = '/';
    }

    return(
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
                       <InboxIconButton color="inherit"   onClick={handleOpenPopover}>
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
                        >
                        <Box p={2}>
                        <Typography variant="h1">Broadcasts</Typography>
                        {broadcasts.map((broadcast, index) => (
                        <Typography key={index}>{broadcast.message}</Typography>
                        ))}
                        </Box>
                        </Popover>
                        </Grid>       

       
                    <Grid xs={3}><WhiteTextButton variant="text"  className="signout" onClick={handleSignOut}> Sign Out </WhiteTextButton></Grid>
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
    </>);
}

export default PageContainer;