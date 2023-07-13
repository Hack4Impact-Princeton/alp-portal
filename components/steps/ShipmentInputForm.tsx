import React from "react";
import { Box, Modal, TextField, Typography } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";

type ShipmentInputFormProps = {
    isOpen: boolean,
}

const ShipmentInputForm: React.FC<ShipmentInputFormProps> = ({isOpen}) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return(
        <Modal
            open={isOpen}
            aria-describedby="shipment-input-modal"
        >
            <Box sx={style}>
                <Typography variant="h4">Input Shipment Information</Typography>
                <Grid item xs={4} sx={{ pb: 2 }}>
                    <Typography variant="h5">Date Sent:</Typography>
                    <Grid item xs={8} sx={{pb: 2 }} s>
                        <TextField size="small" fullWidth={false} id="date-sent" variant="outlined" sx={{pr:5}}/>
                    </Grid>
                    <Grid item xs={4} sx={{ pb: 2 }}>
                        <Typography variant="h5">Books Collected:</Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ pb: 2 }}>
                        <TextField size="small" id="books-collected" variant="outlined" sx={{pr:5}}/>
                    </Grid>
                    <Grid item xs={4} sx={{ pb: 2 }}>
                        <Typography variant="h5">Boxes Collected:</Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ pb: 2 }}>
                        <TextField size="small" id="boxes-collected" variant="outlined" sx={{pr:5}}/>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default ShipmentInputForm;