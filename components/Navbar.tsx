import { Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import Person2Icon from '@mui/icons-material/Person2';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';

const drawerWidth: number = 80;

type NavbarProps = {
    active: "dash-volunteer" | "profile" | "leaderboard" | "h4i-team" | "forum" | "instruction-steps" | null;
}
const Navbar: React.FC<NavbarProps> = ({active}) => {
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
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon fontSize='large' sx={{
                                    color: active === 'dash-volunteer' ? 'orange' : '#9C9C9C',
                                }}></HomeIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/volunteeraccounts/profile">
                    <ListItem key="Organizer Checklist">
                        <ListItemButton>
                            <ListItemIcon>
                                <Person2Icon fontSize='large' sx={{
                                    color: active === 'profile' ? 'orange' : '#9C9C9C',
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
                                    color: active === 'leaderboard' ? 'orange' : '#9C9C9C',
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
                                    color: active === 'h4i-team' ? 'orange' : '#9C9C9C',
                                }}></ShareIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/forum">
                    <ListItem key="Forum">
                        <ListItemButton>
                            <ListItemIcon>
                                <FilterFramesIcon fontSize = 'large' sx={{
                                    color: '#9C9C9C',}}></FilterFramesIcon> 
                                
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </Link>
            <Link href = "/conversations">
                <ListItem key = "Conversations">
                    <ListItemButton>
                        <ListItemIcon>
                            <ChatBubbleIcon fontSize = 'large' sx = {{color:
                            '#9C9C9C',}}>
                            </ChatBubbleIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </Link>
            </List>
        </Drawer>
    );
}
export default Navbar