import Grid from "@mui/material/Unstable_Grid2";
import ProgressBar from "./ProgressBar";

export default function DashviewDriveCard(props) {
  return (
    <div className="DashviewDriveCard">
      <Grid container spacing={2} sx={{border: "5px solid black", padding: "2rem"}} >
        <Grid item xs={7}>
          <h2> {props.drivename} </h2>
        </Grid>
        <Grid item xs={5}>
          <h2 style={{textAlign: "right"}}>Next deadline: {props.deadline} </h2>
        </Grid>
        <Grid item xs = {12}>
            <h2> Steps placeholder </h2>
        </Grid>
        <Grid item xs = {12}>
            <h2> Books bar placeholder </h2>
        </Grid>
      </Grid>
    </div>
  );
}
