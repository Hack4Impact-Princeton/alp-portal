import { NextPage } from "next";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import useDynamicPadding from "../lib/useDynamicPadding";
import RecentPostsContainer from "../components/friendpfp/RecentPostsContainer"

type FriendProfileProps = {
    name: string
  };

const FriendProfile: NextPage<FriendProfileProps> = ({ name,
}) => {

    return (
        <Grid2>
        <Navbar active="forum" />
            <Grid2
            display="flex"
            flexDirection="column"
            container
            sx={{
                pl: useDynamicPadding(635, 775, "29vw", "20vw", "15vw"),
                pt: "5vh",
                pr: "5vw",
                width: "100%",
                justifyContent: "space-between",
            }}
            spacing={2}
            >
                <Grid2 className="page header" display="flex" flexDirection="row" alignItems={"center"} padding={0}>
                    <div style={{border:"1.5px solid black", height:"80px", width:"80px", marginRight:"20px"}}>pfp here</div>
                    <Grid2 display={"flex"} flexDirection={"column"}>
                        <h1 style={{fontSize:"50px", marginBottom:"5px"}}>JOHN DOE</h1> {/*TODO: UPDATE FIELDS*/}
                        <p style={{fontSize:"20px"}}>AZ | 3 book drives completed</p>
                    </Grid2>
                </Grid2>
                <Grid2 className="body container" display={"flex"} flexDirection="row" border={"1.5px solid black"} width={"95%"} padding={0} marginTop={5}>
                    <Grid2 className="left column" display={"flex"} flexDirection="column" width={"70%"} marginRight={3}>
                        <RecentPostsContainer name={"John"}/>
                    </Grid2>
                    <Grid2 className="right column" display={"flex"} flexDirection="column" width={"30%"} border={"1.5px solid red"}>

                    </Grid2>

                </Grid2>
            </Grid2>
        </Grid2>
    )
}

export default FriendProfile