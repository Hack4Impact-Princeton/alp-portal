import { Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';

const drawerWidth = 80;

export default function Navbar() {
    return(
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    alignContent: 'space-evenly',
                    justifyContent: 'center',
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: 'orange',
                }
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                {/* Uncommenting out the Link causes the icons to render incorrectly, why? */}
                {/* <Link href="/home" passHref> */}
                    <ListItem key="Home" sx={{
                        alignItems: 'center',
                    }}>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <HomeIcon fontSize='large' sx={{
                                    color: 'white',
                                }}></HomeIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                {/* </Link> */}
                <ListItem key="Organizer Checklist">
                    <ListItemButton>
                        <ListItemIcon>
                            <FormatListNumberedIcon fontSize='large' sx={{
                                color: 'white',
                            }}></FormatListNumberedIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <ListItem key="Milestones">
                    <ListItemButton>
                        <ListItemIcon>
                            <FlagIcon fontSize='large' sx={{
                                color: 'white',
                            }}></FlagIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <ListItem key="Contact Us">
                    <ListItemButton>
                        <ListItemIcon>
                            <ShareIcon fontSize='large' sx={{
                                color: 'white',
                            }}></ShareIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <ListItem key="Forum">
                    <ListItemButton>
                        <ListItemIcon>
                            <ChatBubbleIcon fontSize='large' sx={{
                                color: 'white',
                            }}></ChatBubbleIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}