import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";


type ShipmentInfoProps = {
    date: string,
    trackingCode: string,
    numBooks: number,
    numBoxes: number, 
}

const ShipmentInfo: React.FC<ShipmentInfoProps> = ({ date, trackingCode, numBooks, numBoxes }) => {
    return(
        <Grid container direction="column" sx={{p:2}} xs={3}>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue", fontWeight:"Bold"}}>{(new Date(date)).toDateString()}</Typography></Grid>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue"}}>Tracking: {trackingCode}</Typography></Grid>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue"}}>{numBooks} books in {numBoxes} boxes</Typography></Grid>
        </Grid>
    )
}

export default ShipmentInfo;

