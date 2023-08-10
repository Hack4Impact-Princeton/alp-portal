import { Typography, TextField, Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import { getDisplayName } from "../../node_modules/next/dist/shared/lib/utils";
import ShipmentInputForm from "./ShipmentInputForm";
import ShipmentInfo from "./ShipmentInfo";
import {Shipment} from '../../models/Shipment';
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
    shipments: Shipment[]
}


const InstructionShipmentCard: React.FC<ShipmentCardProps> = ({ driveCode, driveStatus, handleSaveShipment, shipments }) => {
    const [displayData, setDisplayData] = useState(shipments);
    const [openInputForm, setOpenInputForm] = useState(false);      // controls 
    const styles = {
        btn: {
          backgroundColor: "#FE9834",
          width: "14vw"
        },
    }
    
    console.log("Card render: ", displayData);
    // console.log(typeof shipments[0].date)
    return(
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
            <Grid container alignItems="center" sx={{ p: 5 }}>
             <Grid xs={12} sx ={{ pb: 4 }}>
                <Typography variant="h4">
                    <span>Shipment Info</span>
                </Typography>
            </Grid>
            <Grid container xs={12} direction="row">
                {shipments.map((shipment) => <ShipmentInfo date={shipment.date} trackingCode={shipment.trackingCode} numBooks={shipment.numBooks} numBoxes={shipment.numBoxes}></ShipmentInfo>)}
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