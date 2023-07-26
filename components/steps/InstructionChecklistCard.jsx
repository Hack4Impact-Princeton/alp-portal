import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Checkbox, FormControlLabel, Grid } from '@mui/material';
//import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

// A generic type of card that would go within an InstructionGroup
export default function InstructionChecklistCard(props) {
    let cardContent = <></>;
    switch (props.stepNum) {
        case 1: 
            cardContent=
            <StepOneCard
                driveCode={props.driveCode}
                info={props.driveStatus.gettingStarted}> 
            </StepOneCard> 
            break;
        case 5: 
            cardContent=
            <StepFiveCard
                driveCode={props.driveCode}
                info = {props.driveStatus.prepareToShip}> 
            </StepFiveCard>
            break;
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
        {cardContent}
        
    </Grid>
    );
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
        <Grid container alignItems="center" sx={{ p: 5 }}>
            <Grid item xs={12} sx ={{ pb: 4 }}>
                <Typography variant="h4">
                    <span>Read the Book Collection Guidelines</span> 
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ pb: 5 }}>
                <a href="https://www.youtube.com/watch?v=s4Ow55AbdCg&ab_channel=HYBELABELS">Click here to view the guidelines.</a>
            </Grid>
            <Grid item xs={12}>
                {currState      // default render checked or not
                ? <FormControlLabel sx={{
                    '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                    }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} defaultChecked/>} onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                : <FormControlLabel sx={{
                    '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                    }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} />}onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                }
                
            </Grid> 
        </Grid>
    )
}

// 5: Collect Packing Materials
function StepFiveCard(props) {
    const [collectedBoxes, setCollectedBoxes] = useState(props.info.materials.boxes);
    const [collectedTape, setCollectedTape] = useState(props.info.materials.tape);
    const [collectedLabels, setCollectedLabels] = useState(props.info.materials.mailingLabels);
    const [collectedExtraBoard, setCollectedExtraBoard] = useState(props.info.materials.extraCardboard);
    

    const handleClick = async(boxNum) => {
        try {
            // initialize data object with all unchaned fields
            let data = {
                pts: {
                intFee: 100,
                domFee: 100,
                materials: {
                    boxes: collectedBoxes, 
                    tape: collectedTape, 
                    mailingLabels: collectedLabels, 
                    extraCardboard: collectedExtraBoard}
                }
            }
            // whichever box was checked, change that field
            switch(boxNum) {
                case 0: 
                    data.pts.materials.boxes = !collectedBoxes;
                    setCollectedBoxes(() => !collectedBoxes);
                    break;
                case 1:
                    data.pts.materials.tape = !collectedTape;
                    setCollectedTape(() => !collectedTape);
                    break;
                case 2:
                    data.pts.materials.mailingLabels = !collectedLabels;
                    setCollectedLabels(() => !collectedLabels);
                    break;
                case 3:
                    data.pts.materials.extraCardboard = !collectedExtraBoard;
                    setCollectedExtraBoard(() => !collectedExtraBoard);
                    break;
            }


            console.log("data: ", JSON.stringify(data));
            const resJson = await fetch(`/api/bookDrive/${props.driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }).then(res => res.json());
            console.log(resJson.data)
            console.log("done");
            } catch (e) {
            console.error(e)
        }
    }

    return(
        <Grid container alignItems="center" spacing={0} sx={{ p: 5 }}>
            <Grid item xs={12} sx ={{ pb: 4 }}>
                <Typography variant="h4">
                    <span>Gather Shipping Materials</span> 
                </Typography>
            </Grid>
                <Grid xs={6}>
                    {collectedBoxes
                        ?   <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} defaultChecked/>} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                        :   <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} />} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                    }
                    </Grid>   
                <Grid xs={6}>
                    {collectedTape
                        ? <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} defaultChecked/>} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                        : <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}}/>} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                    }
                </Grid> 
                <Grid xs={6}>
                    {collectedLabels
                        ? <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} defaultChecked/>} onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                        : <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} />}onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                    }
                </Grid>  
                <Grid xs={6}> 
                    {collectedExtraBoard
                        ? <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} defaultChecked/>} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                        : <FormControlLabel sx={{
                            '.MuiFormControlLabel-label':{fontFamily:"Epilogue"},
                            }}control={<Checkbox sx={{color:"#FE9834", '&.Mui-checked': {color: "#FE9834",},}} />} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                    }
                    
                </Grid> 
        </Grid>
    )
}
