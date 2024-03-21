import {
  Box,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import InboxIcon from "@mui/icons-material/Inbox";
import Navbar from "../components/AdminNavbar";
import { signOut } from "next-auth/react";
import useDynamicPadding from "../lib/useDynamicPadding";
import { Margin } from "@mui/icons-material";

type PageContainerProps = {
  fName: String;
  currPage: "dashboard" | "directory" | "broadcast" | null;
};

const PageContainer: React.FC<PageContainerProps> = ({ fName, currPage }) => {
  const leftPaddingValue = useDynamicPadding(635, 775, "29vw", "20vw", "15vw");
  const WhiteTextButton = styled(Button)<ButtonProps>(() => ({
    color: "white",
  }));

  let pageName = "";
  let fontsize = "";
  switch (currPage) {
    case "directory": {
      pageName = "Directory";
      fontsize = "90px";
      break;
    }
  }

  const handleSignOut = () => {
    console.log("Signing out user");
    signOut();
    window.location.href = "/";
  };

  return (
    <>
      <Grid>
        <Navbar active={currPage}></Navbar>
        <Box
          sx={{
            float: "right",
            height: "10vh",
            minHeight: "63px",
            width: fName.length > 10 ? "30vw" : "25vw",
            minWidth: fName.length > 10 ? "353px" : "320px",
            backgroundColor: "#fe9834",
            borderRadius: "5px",
            pt: "5px",
          }}
        >
          <Grid
            container
            flex-direction="row"
            justifyContent="space-between"
            paddingX="10px"
            alignItems="center"
          >
            <Grid xs={4} sx={{ marginRight: fName.length > 10 ? 5 : 1 }}>
              <h3>Welcome, {fName}</h3>
            </Grid>
            <Grid xs={3}>
              <WhiteTextButton
                variant="text"
                className="signout"
                onClick={handleSignOut}
              >
                {" "}
                Sign Out{" "}
              </WhiteTextButton>
            </Grid>
            <Grid xs={2}>
              <img src="/alp-logo.png" alt="alp-logo" height="59px"></img>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid
        xs={12}
        sx={{
          pl: leftPaddingValue,
        }}
      >
        <Box
          sx={{
            height: "12vh",
          }}
        ></Box>
      </Grid>
    </>
  );
};

export default PageContainer;
