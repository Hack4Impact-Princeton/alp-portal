import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


type ShipmentInfoProps = {
    date: Date,
    trackingCode: string,
    numBooks: number,
    numBoxes: number, 
}

const ShipmentInfo: React.FC<ShipmentInfoProps> = ({ date, trackingCode, numBooks, numBoxes }) => {
    console.log(typeof date)
    return(
        <Grid container direction="column" sx={{p:2}} xs={3}>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue", fontWeight:"Bold"}}>{date.toDateString()}</Typography></Grid>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue"}}>Tracking: {trackingCode}</Typography></Grid>
            <Grid xs={12}><Typography sx={{fontFamily: "Epilogue"}}>{numBooks} books in {numBoxes} boxes</Typography></Grid>
        </Grid>
    )
}

export default ShipmentInfo;

