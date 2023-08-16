import Grid from "@mui/material/Unstable_Grid2";
import * as React from 'react';
import Box from "@mui/material/Box"
import ProgressBar from "./ProgressBar";
import Paper from "@mui/material/Paper"
import Link from "next/link";
import CircularIIcon from "./CircularIIcon";
import { BookDriveSchema } from "../models/BookDrive";
import { BookDriveStatus } from "../lib/enums";


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
                        <p style={{ textAlign: "left" }}>Books</p>
                    </Grid>
                    <Grid item xs={11}>
                        <ProgressBar {...props}></ProgressBar>
                    </Grid>
                    <Grid item style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "wrap-content" }}>
                        {props.drive.status !== BookDriveStatus.Cancelled && <a href="https://www.youtube.com/watch?v=4gBlND7UjFw" style={{ fontSize: '2vh' }}>View/Update Your Progress</a>}
                        {props.drive.status == BookDriveStatus.Cancelled && <p onClick={props.openNewReqModal} style={{textDecoration: "underline", cursor: "pointer", fontSize: "2vh"}}>Request Reactivation</p>}
                        <CircularIIcon flipCard={props.flipCard}/>
                    </Grid>
                </Grid>

            </Box>

        </>
    )
}




