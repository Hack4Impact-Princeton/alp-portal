import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Checkbox, FormControlLabel, Grid } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid'; // Grid version 2
type InstructionChecklistCardProps = {
    driveCode: string,
    driveStatus: {
        gettingStarted:
        { fundraise: string, terms: boolean },
        collectingBooks:
        { booksCurrent: number, updateFreq: number, lastUpdate: string }
        prepareToShip:
        { infee: number, domfee: number, materials: { boxes: boolean, extraCardboard: boolean, tape: boolean, mailingLabels: boolean } }
        finishLine: {
            startDate: string, endDate: string, dateSent: string, numBoxes: number, numBooks: number, shipFee: number
        }
    },
    heading: string,
    stepNum: number
}
// A generic type of card that would go within an InstructionGroup
const InstructionChecklistCard: React.FC<InstructionChecklistCardProps> = ({ driveCode, driveStatus, heading, stepNum }) => {
    const _switchContent = () => {
        switch (stepNum) {
            case 1:
                return (
                    <>
                        <StepOneCard
                            driveCode={driveCode}
                            info={driveStatus.gettingStarted}>
                        </StepOneCard>
                    </>);
            case 5:
                return (
                    <>
                        <StepFiveCard
                            driveCode={driveCode}
                            info={driveStatus.prepareToShip}>
                        </StepFiveCard>
                    </>);
            default:
        }
    }
    return (
        <Grid
            sx={{
                border: "3px solid black;",
                borderRadius: "5px",
                backgroundColor: "#F5F5F5"
            }}
            container
            direction="row"
            spacing={3}
            minWidth={"50%"}
        >   
            <Grid item xs={12}>
                <Typography variant="h4">
                    <span>{heading}</span>
                </Typography>
            </Grid> 
            {_switchContent()}
        </Grid>)
}

export default InstructionChecklistCard

// 1: Read Collection Guidelines
type StepOneCardProps = {
    driveCode: string,
    info: { fundraise: string, terms: boolean },

}
const StepOneCard: React.FC<StepOneCardProps> = ({ driveCode, info }) => {
    const [currState, setCurrState] = useState(info.terms)

    const handleTermsCheck = async () => {
        console.log("click");
        try {
            const data = {
                gs: {
                    fundraise: info.fundraise,
                    terms: !currState,
                }
            }
            console.log("data: ", JSON.stringify(data));
            await fetch(`/api/bookDrive/${driveCode}`, {
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
type StepFiveCardProps = {
    driveCode: string,
    info: { infee: number, domfee: number, materials: { boxes: boolean, extraCardboard: boolean, tape: boolean, mailingLabels: boolean } }
}
const StepFiveCard: React.FC<StepFiveCardProps> = ({driveCode, info}) => {
    // console.log("PROPS: ", props);
    const [collectedBoxes, setCollectedBoxes] = useState(info.materials.boxes);
    const [collectedTape, setCollectedTape] = useState(info.materials.tape);
    const [collectedLabels, setCollectedLabels] = useState(info.materials.mailingLabels);
    const [collectedExtraBoard, setCollectedExtraBoard] = useState(info.materials.extraCardboard);

    const handleClick = async (boxNum: number) => {
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


            console.log("data: ", JSON.stringify(data));
            const resJson = await fetch(`/api/bookDrive/${driveCode}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }).then(res => res.json());
            console.log(resJson.data)
            console.log("done");
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
