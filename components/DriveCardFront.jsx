import Grid from "@mui/material/Unstable_Grid2";
import * as React from 'react';
import Box from "@mui/material/Box"
import ProgressBar from "./ProgressBar";
import Paper from "@mui/material/Paper"



export default function DriveCardFront(props) {
    console.log(props)
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <h2> {props.drive.driveName} </h2>
                        <h3 style={{ fontWeight: 200 }}> {props.drive.country} </h3>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 style={{ textAlign: "right" }}>Next deadline: {props.drive.deadline} </h3>
                    </Grid>
                    <Grid item xs={1}>
                        <p stlye={{textAlign: "left"}}>Books</p>
                    </Grid>
                    <Grid item xs={11}>
                        <ProgressBar {...props}></ProgressBar>
                    </Grid>
                    <Grid item xs={4}>
                        <a href="/test" style={{ fontSize: '2vh' }}>View/Update Your Progress</a>
                    </Grid>
                </Grid>

            </Box>

        </>
    )
}




