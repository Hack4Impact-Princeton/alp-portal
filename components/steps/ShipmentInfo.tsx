import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

type ShipmentInfoProps = {
    date: Date,
    trackingCode: string,
    numBooks: number,
    numBoxes: number, 
}

const ShipmentInfo: React.FC<ShipmentInfoProps> = ({ date, trackingCode, numBooks, numBoxes }) => {
    return(
        <Grid container direction="column">
            <Grid item><Typography>{date}</Typography></Grid>
            <Grid item><Typography>{trackingCode}</Typography></Grid>
            <Grid item><Typography>{numBooks} books in {numBoxes} boxes</Typography></Grid>
        </Grid>
    )
}

export default ShipmentInfo;

