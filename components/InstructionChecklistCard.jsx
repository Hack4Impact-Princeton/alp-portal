import { useState } from 'react';
import { Typography, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

// A generic type of card that would go within an InstructionGroup
export default function InstructionChecklistCard(props) {
    let cardContent = <></>;
    switch (props.stepNum) {
        case 1: 
            cardContent = <StepOneCard
                driveCode={props.driveCode}
                info={props.driveStatus.gettingStarted}> 
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
              <span>{props.heading}</span>
            </Typography>
        </Grid>
        {cardContent}
    </Grid>)
}

// 1: Read Collection Guidelines
function StepOneCard(props) {
    const [currState, setCurrState] = useState(props.info.terms)
    console.log("CURR STATE: ", currState);
    console.log(props.driveCode)

    const handleTermsCheck = async () => {
        console.log("click");
        try {
            const data = {
                gs: {
                    fundraise: props.info.fundraise,
                    terms: !currState,}
            }
            console.log("data: ", JSON.stringify(data));
            await fetch(`/api/bookDrive/${props.driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            setCurrState(()=> !currState)
            console.log(currState)
            console.log("done");
            } catch (e) {
            console.error(e)
        }
    }
    return(
        <Grid container alignItems="center" sx={{ p: 5 }}>
            <Grid item sx={{ pb: 5 }}>
                <span>Click here to view the guidelines.</span>
            </Grid>
            <Grid item xs={8}>
                {currState      // default render checked or not
                ? <FormControlLabel control={<Checkbox defaultChecked/>} onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                : <FormControlLabel control={<Checkbox />} onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                }
                
            </Grid> 
        </Grid>
    )
}

