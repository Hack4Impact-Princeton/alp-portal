import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";

type ShipmentInputFormProps = {
    driveCode: string,
    driveStatus: any,
    handleOpen: Function,
    isOpen: boolean,
    handleSaveShipment: Function,
    cardState: Array<Object>,
    displayNewShipment: Function,
}

const ShipmentInputForm: React.FC<ShipmentInputFormProps> = ({ driveCode, driveStatus, handleOpen, isOpen, handleSaveShipment, cardState, displayNewShipment }) => {
    const [dateVal, setDate] = useState("");
    const [tracking, setTracking] = useState("");
    const [numBooks, setNumBooks] = useState(0);
    const [numBoxes, setNumBoxes] = useState(0);

    const styles = {
        btn: {
            backgroundColor: "#FE9834",
            width: "6vw",
            fontFamily:"Epilogue",
            marginRight:6, 
            marginLeft: 6
        },
        modal: {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",

        },

    };

    const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    }

    const trackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTracking(e.target.value);
    }

    const booksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(e.target.value))) {

        } else {
            setNumBooks(parseInt(e.target.value));
        }
    }

    const boxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(e.target.value))) {

        } else {
            setNumBoxes(parseInt(e.target.value));
        }
    }

    const handleSave = async () => {
        await handleSaveShipment(driveCode, driveStatus, dateVal, tracking, numBooks, numBoxes);
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

    return (
        <Modal
            open={isOpen}
            aria-describedby="shipment-input-modal"
        >
            <Box sx={styles.modal} >
                <Typography sx={{ fontFamily: "Epilogue" }} variant="h4">Input Shipment Information</Typography>
                <Grid container sx={{ p: 2 }} display="flex" alignItems="center" >
                    <Grid item xs={6} sx={{ pb: 2 }}  >
                        <Grid container alignItems="center" display="flex" direction="column" pb="10px">
                            <Typography sx={{ fontFamily: "Epilogue" }} variant="h6">Date Sent:</Typography>
                            <TextField sx={{ fontFamily: "Epilogue" }} size="small" fullWidth={false} id="date-sent" variant="outlined" onChange={dateChange} />
                        </Grid>
                        <Grid container alignItems="center" display="flex" direction="column" pb="10px">
                            <Typography sx={{ fontFamily: "Epilogue" }} variant="h6">Tracking Number:</Typography>
                            <TextField sx={{ fontFamily: "Epilogue"}} size="small" fullWidth={false} id="tracking-num" variant="outlined" onChange={trackingChange} />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ pb: 2 }}>
                    <Grid container alignItems="center" display="flex" direction="column" pb="10px">
                            <Typography sx={{ fontFamily: "Epilogue" }} variant="h6"># Books Collected:</Typography>
                            <TextField sx={{ fontFamily: "Epilogue" }} size="small" id="books-collected" variant="outlined" onChange={booksChange} />
                        </Grid>
                        <Grid container alignItems="center" display="flex" direction="column" pb="10px">
                            <Typography sx={{ fontFamily: "Epilogue",  }} variant="h6"># Boxes Total:</Typography>
                            <TextField sx={{ fontFamily: "Epilogue",  }} size="small" id="boxes-collected" variant="outlined" onChange={boxesChange} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} justifyContent="center">
                        <Grid item><Button style={styles.btn} variant="contained" onClick={handleSave}>Save</Button></Grid>
                        <Grid item><Button style={styles.btn} variant="contained" onClick={() => { handleOpen(false) }}>Cancel</Button></Grid>
                    </Grid>
                </Grid>

            </Box>
        </Modal>
    );
}

export default ShipmentInputForm;