import {
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { styled } from "@mui/material/styles";
import FlagIcon from "@mui/icons-material/Flag";
import Person2Icon from "@mui/icons-material/Person2";
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import FilterFramesIcon from "@mui/icons-material/FilterFrames";

const drawerWidth: number = 80;
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "2vh",
  },
});

type NavbarProps = {
  active: "dashboard" | "directory" | "broadcast" | null;
};
const Navbar: React.FC<NavbarProps> = ({ active }) => {
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          alignContent: "space-evenly",
          justifyContent: "center",
          width: "7vw",
          minWidth: "90px",
          marginRight: 95,
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#EAEAEA",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <Link href="/admin/dashboard">
          <ListItem
            key="Home"
            sx={{
              alignItems: "center",
            }}
          >
            <CustomWidthTooltip title="Home" placement="right" arrow>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon
                    fontSize="large"
                    sx={{
                      color: active === "dashboard" ? "orange" : "#9C9C9C",
                    }}
                  ></HomeIcon>
                </ListItemIcon>
              </ListItemButton>
            </CustomWidthTooltip>
          </ListItem>
        </Link>
        <Link href="/admin/directory">
          <ListItem key="Organizer Checklist">
            <CustomWidthTooltip title="Directory" placement="right" arrow>
              <ListItemButton>
                <ListItemIcon>
                  <Person2Icon
                    fontSize="large"
                    sx={{
                      color: active === "directory" ? "orange" : "#9C9C9C",
                    }}
                  ></Person2Icon>
                </ListItemIcon>
              </ListItemButton>
            </CustomWidthTooltip>
          </ListItem>
        </Link>
        <Link href="broadcast">
          <ListItem key="Brodcasts">
            <CustomWidthTooltip title="Broadcasts" placement="right" arrow>
              <ListItemButton>
                <ListItemIcon>
                  <ChatBubbleIcon
                    fontSize="large"
                    sx={{ color: active == "broadcast" ? "orange" : "#9C9C9C" }}
                  ></ChatBubbleIcon>
                </ListItemIcon>
              </ListItemButton>
            </CustomWidthTooltip>
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};
export default Navbar;
