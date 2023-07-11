import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

// A generic type of card that would go within an InstructionGroup
export default function InstructionChecklistCard(props) {
    // console.log(props)
    const _switchContent = () => {
        switch (props.stepNum) {
            case 1:
                return (
                    <>
                        <StepOneCard
                            updateCompleted={props.updateCompleted}
                            driveCode={props.driveCode}
                            info={props.driveStatus.gettingStarted}>
                        </StepOneCard>
                    </>);
            case 5:
                return (
                    <>
                        <StepFiveCard
                            updateCompleted={props.updateCompleted}
                            driveCode={props.driveCode}
                            info={props.driveStatus.prepareToShip}>
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
    // console.log(props)
    const [currState, setCurrState] = useState(props.info.terms)
    useEffect(() => {
        props.updateCompleted(1, currState)
        // console.log("step 1 registering as ", currState)
        
    }, [currState])

    const handleTermsCheck = async () => {
        console.log("click");
        try {
            const data = {
                gs: {
                    fundraise: props.info.fundraise,
                    terms: !currState,
                }
            }
            console.log("data: ", JSON.stringify(data));
            await fetch(`/api/bookDrive/${props.driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            setCurrState(() => !currState)
            console.log(currState)
            console.log("done");
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Grid container alignItems="center" spacing={0} sx={{ p: 5 }}>
            <Grid item sx={{ pb: 5 }}>
                <span>Click here to view the guidelines.</span>
            </Grid>
            <Grid item xs={8}>
                {currState      // default render checked or not
                    ? <FormControlLabel control={<Checkbox defaultChecked />} onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                    : <FormControlLabel control={<Checkbox />} onChange={handleTermsCheck} label="I have read and understood the collection guidelines." />
                }

            </Grid>
        </Grid>
    )
}

// 5: Collect Packing Materials
function StepFiveCard(props) {
    // console.log("PROPS: ", props);
    const [collectedBoxes, setCollectedBoxes] = useState(props.info.materials.boxes);
    const [collectedTape, setCollectedTape] = useState(props.info.materials.tape);
    const [collectedLabels, setCollectedLabels] = useState(props.info.materials.mailingLabels);
    const [collectedExtraBoard, setCollectedExtraBoard] = useState(props.info.materials.extraCardboard);
    useEffect(() => {
        const res = collectedBoxes && collectedTape && collectedLabels && collectedExtraBoard
        // console.log(res)    
        props.updateCompleted(5, res)
        // console.log("step five registers as ", res)
        
    }, [collectedBoxes, collectedExtraBoard, collectedLabels, collectedTape])
    const handleClick = async (boxNum) => {
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
                        extraCardboard: collectedExtraBoard
                    }
                }
            }
            // whichever box was checked, change that field
            switch (boxNum) {
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


            // console.log("data: ", JSON.stringify(data));
            const resJson = await fetch(`/api/bookDrive/${props.driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }).then(res => res.json());
            // console.log(resJson.data)
            // console.log("done");
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Grid container alignItems="center" spacing={0} sx={{ p: 5 }}>
            <Grid xs={6}>
                {collectedBoxes
                    ? <FormControlLabel control={<Checkbox defaultChecked />} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                    : <FormControlLabel control={<Checkbox />} onChange={() => handleClick(0)} label="Cardboard boxes"></FormControlLabel>
                }
            </Grid>
            <Grid xs={6}>
                {collectedTape
                    ? <FormControlLabel control={<Checkbox defaultChecked />} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                    : <FormControlLabel control={<Checkbox />} onChange={() => handleClick(1)} label="Packaging tape"></FormControlLabel>
                }
            </Grid>
            <Grid xs={6}>
                {collectedLabels
                    ? <FormControlLabel control={<Checkbox defaultChecked />} onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                    : <FormControlLabel control={<Checkbox />} onChange={() => handleClick(2)} label="Mailing Labels"></FormControlLabel>
                }
            </Grid>
            <Grid xs={6}>
                {collectedExtraBoard
                    ? <FormControlLabel control={<Checkbox defaultChecked />} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                    : <FormControlLabel control={<Checkbox />} onChange={() => handleClick(3)} label="Extra cardboard"></FormControlLabel>
                }

            </Grid>
        </Grid>
    )
}
