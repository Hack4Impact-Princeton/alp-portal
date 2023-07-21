import { Drawer, Link, List, ListItem, ListItemButton, ListItemIcon, Tooltip,tooltipClasses, TooltipProps  } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { styled } from '@mui/material/styles';
import FlagIcon from '@mui/icons-material/Flag';
import Person2Icon from '@mui/icons-material/Person2';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';


const drawerWidth: number = 80;
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "2vh"
    },
  });

type NavbarProps = {
    active: "dash-volunteer" | "profile" | "leaderboard" | "h4i-team" | "forum" | null;
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
                        <CustomWidthTooltip title="Home" placement="right" arrow>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon fontSize='large' sx={{
                                    color: active === 'dash-volunteer' ? 'orange' : '#9C9C9C',
                                }}></HomeIcon>
                            </ListItemIcon>
                        </ListItemButton>
                        </CustomWidthTooltip>
                    </ListItem>
                </Link>
                <Link href="/volunteeraccounts/profile">
                    <ListItem key="Organizer Checklist">
                        <CustomWidthTooltip title="Profile" placement="right" arrow>
                        <ListItemButton>
                            <ListItemIcon>
                                <Person2Icon fontSize='large' sx={{
                                    color: active === 'profile' ? 'orange' : '#9C9C9C',
                                }}></Person2Icon>
                            </ListItemIcon>
                        </ListItemButton>
                        </CustomWidthTooltip>
                    </ListItem>
                </Link>
                <Link href="/leaderboard">
                    <ListItem key="Milestones">
                        <CustomWidthTooltip title="Leaderboard" placement="right" arrow>
                        <ListItemButton>
                            <ListItemIcon>
                                <FlagIcon fontSize='large' sx={{
                                    color: active === 'leaderboard' ? 'orange' : '#9C9C9C',
                                }}></FlagIcon>
                            </ListItemIcon>
                        </ListItemButton>
                        </CustomWidthTooltip>
                    </ListItem>
                </Link>
                <Link href="/h4i-team">
                    <ListItem key="Contact Us">
                    <CustomWidthTooltip title="Contact Us" placement="right" arrow>
                        <ListItemButton>
                            <ListItemIcon>
                                <ShareIcon fontSize='large' sx={{
                                    color: active === 'h4i-team' ? 'orange' : '#9C9C9C',
                                }}></ShareIcon>
                            </ListItemIcon>
                        </ListItemButton>
                    </CustomWidthTooltip>
                    </ListItem>
                </Link>
                <Link href="/forum">
                    <ListItem key="Forum">
                    <CustomWidthTooltip title="Forum" placement="right" arrow>
                        <ListItemButton>
                            <ListItemIcon>
                                <FilterFramesIcon fontSize = 'large' sx={{
                                    color: '#9C9C9C',}}></FilterFramesIcon> 
                                
                            </ListItemIcon>
                        </ListItemButton>
                    </CustomWidthTooltip>
                    </ListItem>
                </Link>
            <Link href = "/conversations">
                <ListItem key = "Conversations">
                <CustomWidthTooltip title="Conversations" placement="right" arrow>

                    <ListItemButton>
                        <ListItemIcon>
                            <ChatBubbleIcon fontSize = 'large' sx = {{color:
                            '#9C9C9C',}}>
                            </ChatBubbleIcon>
                        </ListItemIcon>
                    </ListItemButton>
                </CustomWidthTooltip>
                </ListItem>
            </Link>
            </List>
        </Drawer>
    );
}
export default Navbar