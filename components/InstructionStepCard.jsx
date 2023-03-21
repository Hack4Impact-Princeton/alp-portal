import Grid from "@mui/material/Unstable_Grid2";


export default function InstructionStepCard(props) {
  return (
    <div className="InstructionStepCard">
      <Grid container spacing={2} sx={{border: "5px solid black", padding: "2rem"}} >
        <Grid item xs={7}>
          <h1 style={{textAlign: "left"}}> {props.heading} </h1>
        </Grid>
        <Grid item xs={5}>
          <h2 style={{textAlign: "left"}}> {props.subheading} </h2>
        </Grid>
      </Grid>
    </div>
  );
}