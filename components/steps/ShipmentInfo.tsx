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
        <Grid container direction="column">
            <Grid item><Typography>{date.toDateString()}</Typography></Grid>
            <Grid item><Typography>Tracking: {trackingCode}</Typography></Grid>
            <Grid item><Typography>{numBooks} books in {numBoxes} boxes</Typography></Grid>
        </Grid>
    )
}

export default ShipmentInfo;

