import { Drawer, Link, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';


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
            anchor="bottom"
        >
            
        </Drawer>
    );
}