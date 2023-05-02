import Grid from "@mui/material/Unstable_Grid2";
import * as React from 'react';
import Box from "@mui/material/Box"
import ProgressBar from "./ProgressBar";
import Paper from "@mui/material/Paper"



export default function DriveCardFront(props) {
    return(
    <>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
        <Grid item xs={8}>
            <h2> {props.drivename} </h2>
        </Grid>
        <Grid item xs={4}>
            <h3 style={{textAlign: "right"}}>Next deadline: {props.deadline} </h3>
        </Grid>
        <Grid item xs={1}>
            <p>Books</p>
        </Grid>
        <Grid item xs={11}>
            <ProgressBar {...props}></ProgressBar> 
        </Grid>
        <Grid item xs = {4}>
            <a href="https://www.youtube.com/watch?v=4gBlND7UjFw" style={{fontSize: '2vh'}}>View/Update Your Progress</a>
        </Grid>
        </Grid>

        </Box>
        
    </>
    )
}




