import { Box, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import InboxIcon from '@mui/icons-material/Inbox';
import Navbar from '../components/Navbar'
import { getSession, signOut } from "next-auth/react"
import { useState, useEffect } from 'react'
import { Broadcast } from '../models/Broadcast';
import BroadcastMessage from './BroadcastMessage';
type PageContainerProps = {
    fName: String;
    currPage: "dash-volunteer" | "profile" | "instruction-steps" | "h4i-team" | "forum" | "leaderboard";
    broadcasts: Broadcast[] | null;
    email: string;
}
interface isReadMapType {
    myMap: Map<string, boolean>
}

const PageContainer: React.FC<PageContainerProps> = ({ fName, email, currPage, broadcasts }) => {
    const [expandInbox, setExpandInbox] = useState(false)
    const [isReadMap, setIsReadMap] = useState<isReadMapType>({ myMap: new Map<string, boolean>() })

    const [unread, setUnread] = useState(0)
    useEffect(() => {
        broadcasts?.forEach((broadcast) => {
            for (let i = 0; i < broadcast.receiverEmails.length; i++) {
                if (broadcast.receiverEmails[i] === email) {
                    const { id, read } = broadcast
                    updateIsReadMap(id, read[i])
                    break;
                }
            }
        })
    }, [])
    const updateIsReadMap = (broadcastId: string, isRead: boolean) => {
        // if (isRead == true) console.log("adding isRead to " + broadcastId)

        setIsReadMap(prevMap => {
            const updatedMap = new Map(prevMap.myMap)
            updatedMap.set(broadcastId, isRead)
            return { myMap: updatedMap }
        })
        if (!isRead) setUnread(curr => curr + 1)
    }

    const markAsRead = async (broadcastId: string, isRead: boolean) => {
        if (isReadMap.myMap.get(broadcastId) != isRead) {
            updateIsReadMap(broadcastId, isRead)
            const res = await fetch(`/api/broadcast/${broadcastId}`, {
                method: "PUT",
                body: JSON.stringify({ email: email, bool: isRead })
            })
            const resJson = await res.json();
            if (res.status != 200) {
                console.log("something went wrong: ", resJson.data)
                return
            }
            else console.log("update: ", resJson.data)
            if (isRead) setUnread(curr => curr - 1)
        }
    }

    const WhiteTextButton = styled(Button)<ButtonProps>(() => ({
        color: 'white',
    }));

    let pageName = "";
    switch (currPage) {
        case "dash-volunteer": {
            pageName = "Home";
            break;
        }
        case "profile": {
            pageName = "Profile";
            break;
        }
        case "instruction-steps": {
            pageName = "Organizer Steps";
            break;
        }
        case "h4i-team": {
            pageName = "The Developer Team";
            break;
        }
        case "forum": {
            pageName = "Forum";
            break;
        }
        case "leaderboard": {
            pageName = "Leaderboard";
            break;
        }
    }

    const handleSignOut = () => {
        console.log("Signing out user");
        signOut();
        window.location.href = '/';
    }

    return (
        <>
            <Grid>
                <Navbar active={currPage}></Navbar>
                <Box sx={{
                    float: 'right',
                    height: '12vh',
                    width: '35vw',
                    backgroundColor: '#fe9834',
                    borderRadius: '5px',
                    pt: '5px'
                }}>
                    <Grid container flex-direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingLeft={1}>
                        <Grid xs={4}><h3>Welcome, {fName}</h3></Grid>
                        {!expandInbox && <Grid onClick={() => setExpandInbox(true)} xs={2} sx={{ display: "flex", flexDirection: "row", alignItems: "center", border: "2.75px solid black", justifyContent: "center", width: "fit-content", padding: .5, borderRadius: "30%", cursor: "pointer" }}>
                            <InboxIcon></InboxIcon>
                            <h4 style={{ fontWeight: "800" }}>{unread > 0 ? unread : ""}</h4>
                        </Grid>}
                        {expandInbox &&
                            <Box style={{ margin: 15, padding: 10, width: "350px", position: 'absolute', top: 0, right: 0, height: "35%", zIndex: 200, overflowY: "auto", backgroundColor: "#FFFFFF", border: "1.5px solid black" }}>
                                <button style={{ cursor: "pointer" }} onClick={() => setExpandInbox(false)}>Minimize</button>
                                {broadcasts?.map((broadcast) => <BroadcastMessage isVolunteer={true} key={broadcast.id} onRead={markAsRead} isRead={isReadMap.myMap.get(broadcast.id)} broadcast={broadcast} />)}
                                {unread == 0 && <p style={{ padding: 10, margin: 10, textAlign: "center" }}>No broadcasts</p>}
                            </Box>
                        }
                        <Grid xs={3}><WhiteTextButton variant="text" onClick={handleSignOut}> Sign Out </WhiteTextButton></Grid>
                        <Grid xs={2}><img src="/alp-logo.png" alt="alp-logo" height="55px"></img></Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid xs={12} sx={{
                pl: '10vw',
            }}>
                <Box sx={{
                    height: '12vh',
                }}></Box>
                <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>{pageName}</h1>
            </Grid>
        </>);
}

export default PageContainer;