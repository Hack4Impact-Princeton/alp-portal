import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";

type ShipmentInputFormProps = {
    driveCode: string,
    isOpen: boolean,
    handleSaveShipment: Function,
}

const ShipmentInputForm: React.FC<ShipmentInputFormProps> = ({driveCode, isOpen, handleSaveShipment}) => {
    const [dateVal, setDate] = useState("");
    const [tracking, setTracking] = useState("");
    const [numBooks, setNumBooks] = useState(0);
    const [numBoxes, setNumBoxes] = useState(0);


    const styles = {
        btn: {
            backgroundColor: "#FE9834",
            width: "5vw"
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
        handleSaveShipment(driveCode, dateVal, tracking, numBooks, numBoxes);
    }

    return(
        <Modal
            open={isOpen}
            aria-describedby="shipment-input-modal"
        >
            <Box sx={styles.modal}>
                <Typography variant="h4">Input Shipment Information</Typography>
                <Grid container sx={{ pb: 2 }}>
                    <Grid item xs={6} sx={{pb: 2}}>
                        <Typography variant="h5">Date Sent:</Typography>
                        <TextField size="small" fullWidth={false} id="date-sent" variant="outlined" onChange={dateChange} sx={{pr:5}}/>
                        <Typography variant="h5">Tracking Number:</Typography>
                        <TextField size="small" fullWidth={false} id="date-sent" variant="outlined" onChange={trackingChange} sx={{pr:5}}/>
                    </Grid>    
                    <Grid item xs={6} sx={{ pb: 2 }}>
                        <Typography variant="h5"># Books Collected:</Typography>
                        <TextField size="small" id="books-collected" variant="outlined" onChange={booksChange} sx={{pr:5}}/>
                        <Typography variant="h5"># Boxes Total:</Typography>
                        <TextField size="small" id="boxes-collected" variant="outlined" onChange={boxesChange} sx={{pr:5}}/>
                    </Grid>
                    <Grid container xs={12} direction="row" spacing={2}>
                        <Grid><Button style={styles.btn} onClick={handleSave}>Save</Button></Grid>
                        <Grid><Button style={styles.btn}>Cancel</Button></Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default ShipmentInputForm;