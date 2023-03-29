import Grid from "@mui/material/Unstable_Grid2";
import DriveCardFront from "./DriveCardFront"


export default function DriveCard(props) {
  if (!props.back) {
    return (
      <div className="DashviewDriveCard">
        <Grid container spacing={2} sx={{border: "2px solid black", padding: "2rem"}} >
          <DriveCardFront {...props}></DriveCardFront>
        </Grid>
      </div>
    );
  } else {
    return (
      <div className="DashviewDriveCard">
        <Grid container spacing={2} sx={{border: "2px solid black", padding: "2rem"}} >
          
        </Grid>
      </div>
    );
  }
}
