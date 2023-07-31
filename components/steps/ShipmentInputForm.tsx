import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import {Grid} from "@mui/material";

type ShipmentInputFormProps = {
    driveCode: string,
    driveStatus: any,
    handleOpen: Function,
    isOpen: boolean,
    handleSaveShipment: Function,
    cardState: Array<Object>,
    displayNewShipment: Function,
}

const ShipmentInputForm: React.FC<ShipmentInputFormProps> = ({driveCode, driveStatus, handleOpen, isOpen, handleSaveShipment, cardState, displayNewShipment}) => {
    const [dateVal, setDate] = useState("");
    const [tracking, setTracking] = useState("");
    const [numBooks, setNumBooks] = useState(0);
    const [numBoxes, setNumBoxes] = useState(0);


    const styles = {
        btn: {
            backgroundColor: "#FE9834",
            width: "5vw",
        },
        modal: {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            
        },
        
    };

    const dateChange = (e) => {
        setDate(e.target.value);
    }

    const trackingChange = (e) => {
        setTracking(e.target.value);
    }

    const booksChange = (e) => {
        if (isNaN(e.target.value)) {

        } else {
            setNumBooks(parseInt(e.target.value));
        }
    }

    const boxesChange = (e) => {
        if (isNaN(e.target.value)) {

        } else {
            setNumBoxes(parseInt(e.target.value));
        }
    }

    const handleSave = async () => {
        handleSaveShipment(driveCode, driveStatus, dateVal, tracking, numBooks, numBoxes);
        const obj = {
            data: {
                date: dateVal,
                trackingCode: '654',
                numBoxes: 1,
                numBooks: 25,
            }
        }
        displayNewShipment([...cardState, obj])
        handleOpen(false);
    }

    return(
        <Modal
            open={isOpen}
            aria-describedby="shipment-input-modal"
        >
            <Box sx={styles.modal} >
                <Typography sx={{fontFamily:"Epilogue"}} variant="h4">Input Shipment Information</Typography>
                <Grid container sx={{ p: 2 }}>
                    <Grid item xs={6} sx={{pb: 2}}>
                        <Grid container >
                            <Typography sx={{fontFamily:"Epilogue"}} variant="h5">Date Sent:</Typography>
                            <TextField sx={{fontFamily:"Epilogue"}} size="small" fullWidth={false} id="date-sent" variant="outlined" onChange={dateChange} sx={{pr:5}}/>
                        </Grid>
                        <Grid container >
                            <Typography sx={{fontFamily:"Epilogue"}} variant="h5">Tracking Number:</Typography>
                            <TextField sx={{fontFamily:"Epilogue"}} size="small" fullWidth={false} id="date-sent" variant="outlined" onChange={trackingChange} sx={{pr:5}}/>
                        </Grid>
                    </Grid>    
                    <Grid item xs={6} sx={{ pb: 2 }}>
                        <Grid container >
                            <Typography sx={{fontFamily:"Epilogue"}} variant="h5"># Books Collected:</Typography>
                            <TextField sx={{fontFamily:"Epilogue"}} size="small" id="books-collected" variant="outlined" onChange={booksChange} sx={{pr:5}}/>
                        </Grid>
                        <Grid container >
                            <Typography sx={{fontFamily:"Epilogue"}} variant="h5"># Boxes Total:</Typography>
                            <TextField sx={{fontFamily:"Epilogue"}} size="small" id="boxes-collected" variant="outlined" onChange={boxesChange} sx={{pr:5}}/>
                        </Grid>
                    </Grid>
                    <Grid xs={9}></Grid>
                    <Grid container xs={3} direction="row" spacing={1}>
                        <Grid item><Button style={styles.btn} onClick={handleSave}>Save</Button></Grid>
                        <Grid item><Button style={styles.btn} onClick={() => {handleOpen(false)}}>Cancel</Button></Grid>
                    </Grid>
                </Grid>
                
            </Box>
        </Modal>
    );
}

export default ShipmentInputForm;