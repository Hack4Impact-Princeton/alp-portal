import { useState } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

export default function InstructionChecklistCard({
    driveCode,
    heading,
    stepNum
}) {
    let cardContent = <></>;
    switch (stepNum) {
        case 1: 
            // read drive.gs.terms to pass in the completion state
            // default to false for now
            cardContent = <StepOneCard
                checked={false}> 
                </StepOneCard>;
        case 5: 
            // read drive.pts.materials to pass in bools
        default: 
    }
    return (
        <Grid
          sx={{
            border: "3px solid black;",
            borderRadius: "5px"
          }}
          container
          direction="row"
          spacing={3}
          minWidth={"50%"}
          backgroundColor="#F5F5F5"
        >
        <Grid item xs={12}>
            <Typography variant="h4">
              <span>{heading}</span> <span>{stepNum}</span>
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h5">{"subheading"}</Typography>
        </Grid>
        {cardContent}
    </Grid>)
}

function StepOneCard() {
    return(<h1>HERE</h1>)
}

