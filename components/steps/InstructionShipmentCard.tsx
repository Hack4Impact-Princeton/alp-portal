import { Typography, TextField, Button } from "@mui/material";
import React, {useEffect, useState} from "react";
import { getDisplayName } from "../../node_modules/next/dist/shared/lib/utils";
import ShipmentInputForm from "./ShipmentInputForm";
import ShipmentInfo from "./ShipmentInfo";
import {Grid} from "@mui/material";
import Box from '@mui/material/Box';

// const driveStatus = {
//     gettingStarted: currDrive.gs,
//     collectingBooks: currDrive.cb,
//     prepareToShip: currDrive.pts,
//     finishLine: currDrive.fl,
// }
type ShipmentCardProps = {
    driveCode: string,
    driveStatus: any,
    handleSaveShipment: Function,
    shipmentData: Array<Object>,
}


const InstructionShipmentCard: React.FC<ShipmentCardProps> = ({ driveCode, driveStatus, handleSaveShipment, shipmentData }) => {
    const [displayData, setDisplayData] = useState(shipmentData);
    const [openInputForm, setOpenInputForm] = useState(false);      // controls 
    const styles = {
        btn: {
          backgroundColor: "#FE9834",
          width: "14vw"
        },
    }

    console.log("Card render: ", displayData);

    return(
        <Grid
            sx={{
                border: "3px solid black;",
                borderRadius: "5px",
                backgroundColor:"#F5F5F5"
            }}
            container
            direction="row"
            spacing={3}
            minWidth={"50%"}
            
            >   
            <Grid container alignItems="center" sx={{ p: 5 }}>
             <Grid xs={12} sx ={{ pb: 4 }}>
                <Typography variant="h4">
                    <span>Shipment Info</span>
                </Typography>
            </Grid>
            <Grid container xs={12} direction="row">
                {shipmentData.map((shipment) => <ShipmentInfo date={shipment.data.date} trackingCode={shipment.data.trackingCode} numBooks={shipment.data.numBooks} numBoxes={shipment.data.numBoxes}></ShipmentInfo>)}
            </Grid>
            
            <Grid xs={12} alignItems="center" sx={{pt:1}}>
                <Button style={styles.btn} variant="contained" size="large" onClick={() => setOpenInputForm(true)}>Log New Shipment</Button>
                <ShipmentInputForm driveCode={driveCode} driveStatus={driveStatus} handleOpen={setOpenInputForm} isOpen={openInputForm} handleSaveShipment={handleSaveShipment} cardState={displayData} displayNewShipment={setDisplayData}></ShipmentInputForm> 
            </Grid>
            </Grid>
           
        </Grid>
    );
}

export default InstructionShipmentCard;