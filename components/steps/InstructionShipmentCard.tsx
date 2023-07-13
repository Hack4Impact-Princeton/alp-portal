import { Typography, TextField, Button } from "@mui/material";
import React, {useEffect, useState} from "react";
import { getDisplayName } from "../../node_modules/next/dist/shared/lib/utils";
import ShipmentInputForm from "./ShipmentInputForm";
import Grid from "@mui/material/Unstable_Grid2";

// const driveStatus = {
//     gettingStarted: currDrive.gs,
//     collectingBooks: currDrive.cb,
//     prepareToShip: currDrive.pts,
//     finishLine: currDrive.fl,
// }
type ShipmentCardProps = {
    driveCode: string,
    driveStatus: string,
    cardState: number,
}

// States 0-2: no shipments created, shipments created unfinalized, shipments created finalized
const InstructionShipmentCard: React.FC<ShipmentCardProps> = ({ driveCode, driveStatus, cardState }) => {
    const [currState, setCurrState] = useState(cardState);
    const [openInputForm, setOpenInputForm] = useState(false);      // controls 
    const styles = {
        btn: {
          backgroundColor: "#FE9834",
          width: "15vw"
        },
    }

    let defaultContent, displayShipments, inputForm;
    defaultContent = <>     
    </>;

    useEffect(() => {
        console.log("openInputForm: ", openInputForm);
        if (openInputForm) {
            inputForm = 
            <>
                <h1>Input Shipment Info</h1>
                <Button variant="contained" size="large" onClick={() => setOpenInputForm(false)}>Save</Button>
            </>;
            console.log("component: ", inputForm);
        } else { 
            inputForm = <></>;
        }
    }, [openInputForm])

    return(
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
            <Button style={styles.btn} variant="contained" size="large" onClick={() => setOpenInputForm(true)}>Log New Shipment</Button>
            <ShipmentInputForm isOpen={true}></ShipmentInputForm>
        </Grid>
    );
}

export default InstructionShipmentCard;