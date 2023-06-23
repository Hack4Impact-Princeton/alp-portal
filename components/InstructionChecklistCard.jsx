import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

// A generic type of card that would go within an InstructionGroup
export default function InstructionChecklistCard(props) {
    const _switchContent = () => {
        switch (props.stepNum) {
            case 1: 
                return(
                <> 
                <StepOneCard
                    driveCode={props.driveCode}
                    info={props.driveStatus.gettingStarted}> 
                </StepOneCard> 
                </>);
            case 5: 
                return(
                <>
                <StepFiveCard
                    driveCode={props.driveCode}
                    info = {props.driveStatus.prepareToShip}> 
                </StepFiveCard>
                </>);
            default: 
        }
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
        {_switchContent()}
    </Grid>)
}

// 1: Read Collection Guidelines
function StepOneCard(props) {
    const [currState, setCurrState] = useState(props.info.terms)

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
        <Grid container alignItems="center" spacing={0} sx={{ p: 5 }}>
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

// 5: Collect Packing Materials
function StepFiveCard(props) {
    console.log("PROPS: ", props);
    const [collectedBoxes, setCollectedBoxes] = useState(props.info.materials.boxes);
    const [collectedTape, setCollectedTape] = useState(props.info.materials.tape);
    const [collectedLabels, setCollectedLabels] = useState(props.info.materials.mailingLabels);
    const [collectedExtraBoard, setCollectedExtraBoard] = useState(props.info.materials.extraCardboard);

    const handleClick = async(boxNum) => {
        try {
            // initialize data object with all unchaned fields
            let data = {
                intFee: 100,
                domFee: 100,
                materials: {
                    boxes: collectedBoxes, 
                    tape: collectedTape, 
                    mailingLabels: collectedLabels, 
                    extraCardboard: collectedExtraBoard}
            }
            // whichever box was checked, change that field
            if (boxNum == 0) {
                data.materials.boxes = !collectedBoxes;
                setCollectedBoxes(!collectedBoxes);
            } else if (boxNum == 1) {
                data.materials.tape = !collectedTape;
                setCollectedTape(!collectedTape);
            } else if (boxNum == 2) {
                data.materials.mailingLabels = !collectedLabels;
                setCollectedLabels(!collectedLabels);
            } else if (boxNum == 3) {
                data.materials.extraCardboard = !collectedExtraBoard;
                setCollectedExtraBoard(!collectedExtraBoard);
            }


            console.log("data: ", JSON.stringify(data));
            await fetch(`/api/bookDrive/${props.driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            console.log("done");
            } catch (e) {
            console.error(e)
        }
    }

    return(
        <Grid container alignItems="center" spacing={0} sx={{ p: 5 }}>
                <Grid xs={6}>
                    {collectedBoxes
                        ?   <FormControlLabel control={<Checkbox defaultChecked/>} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                        :   <FormControlLabel control={<Checkbox/>} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                    }
                    </Grid>   
                <Grid xs={6}>
                    {collectedTape
                        ? <FormControlLabel control={<Checkbox defaultChecked/>} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                        : <FormControlLabel control={<Checkbox/>} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                    }
                </Grid> 
                <Grid xs={6}>
                    {collectedLabels
                        ? <FormControlLabel control={<Checkbox defaultChecked/>} onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                        : <FormControlLabel control={<Checkbox/>} onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                    }
                </Grid>  
                <Grid xs={6}> 
                    {collectedExtraBoard
                        ? <FormControlLabel control={<Checkbox defaultChecked/>} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                        : <FormControlLabel control={<Checkbox/>} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                    }
                    
                </Grid> 
        </Grid>
    )
}
