import React, { useState } from "react";
import Grid from "@mui/material/Grid"; 
import { IconButton,Button } from "@mui/material";


type PageProps = {
    name: string
};

const RecentPostsContainer: React.FC<PageProps> = ({ name,

  }) => {

    return (
        <Grid border="1.5px solid red"
        sx={{
            borderRadius:"2px",
            borderWidth:"3px",
            borderColor:"#C9C9C9",
            backgroundColor:"#F5F5F5",
            padding:2,
        }}>
            <Grid container display="flex" alignItems={'center'} flexDirection={"row"} border="1.5px solid red">
              <h2>{name}'s Recent Post</h2>
              <IconButton
                sx={{ backgroundColor: "#FE9834", color: "#FFFFFF",borderRadius:"30px",pl:2,pr:2,ml:1}}
                size={"small"}
                onClick={() => {
                }}
              >
                <p>more </p>
              </IconButton>
            </Grid>
        </Grid>
    )
  }

export default RecentPostsContainer;