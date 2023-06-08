import { Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import Person2Icon from '@mui/icons-material/Person2';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';

const drawerWidth: number = 80;

export default function Navbar() {
    return(
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    alignContent: 'space-evenly',
                    justifyContent: 'center',
                    width: '7vw',
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: '#EAEAEA',
                }
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <Link href="/dash-volunteer">
                    <ListItem key="Home" sx={{
                        alignItems: 'center',
                    }}>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <HomeIcon fontSize='large' sx={{
                                    color: '#9C9C9C',
                                }}></HomeIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/dash-volunteer">
                    <ListItem key="Organizer Checklist">
                        <ListItemButton>
                            <ListItemIcon>
                                <Person2Icon fontSize='large' sx={{
                                    color: '#9C9C9C',
                                }}></Person2Icon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/leaderboard">
                    <ListItem key="Milestones">
                        <ListItemButton>
                            <ListItemIcon>
                                <FlagIcon fontSize='large' sx={{
                                    color: '#9C9C9C',
                                }}></FlagIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/h4i-team">
                    <ListItem key="Contact Us">
                        <ListItemButton>
                            <ListItemIcon>
                                <ShareIcon fontSize='large' sx={{
                                    color: '#9C9C9C',
                                }}></ShareIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/forum">
                    <ListItem key="Forum">
                        <ListItemButton>
                            <ListItemIcon>
                                <ChatBubbleIcon fontSize='large' sx={{
                                    color: '#9C9C9C',
                                }}></ChatBubbleIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
            </List>
        </Drawer>
    );
}