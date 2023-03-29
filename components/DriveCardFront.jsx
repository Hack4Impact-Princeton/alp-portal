import Grid from "@mui/material/Unstable_Grid2";
export default function DriveCardFront(props) {
    return(
    <>
        <Grid item xs={7}>
            <h2> {props.drivename} </h2>
          </Grid>
          <Grid item xs={5}>
            <h3 style={{textAlign: "right"}}>Next deadline: {props.deadline} </h3>
          </Grid>
          <Grid item xs = {12}>
              <p> Steps placeholder </p>
          </Grid>
          <Grid item xs = {12}>
              <p> Books bar placeholder </p>
        </Grid>
    </>
    )
}




