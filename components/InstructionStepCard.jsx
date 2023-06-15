import { Typography, Grid, TextField } from "@mui/material";

export default function CollectBooksCard({
  heading,
  subHeading,
  submitBtn,
  stepNum,
  numBooksCollected,
}) {
  let HEADER_NUM;

    HEADER_NUM = numBooksCollected
    ? numBooksCollected
    : "Must pass numBooksCollected!";
      
  return (
    <Grid
      sx={{
        border: "3px solid black;",
        borderRadius: "5px"
      }}
      container
      direction="row"
      spacing={3}
      minWidth={"50%"}
      backgroundColor="#F5F5F5"
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          <span>Current Number of Books Collected:</span> <span>{HEADER_NUM}</span>
        </Typography>
      </Grid>

      <CardBody />

      
    </Grid>
  );
}

function CardBody() {
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={4} sx={{ pb: 5 }}>
        <span>Number of New Books Collected:</span>
      </Grid>
      <Grid item xs={8} sx={{ pb: 5 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" />
      </Grid>

      <Grid item xs={11}>
        <span>Please update every X weeks. Last updated 00/00/0000</span>
        
      </Grid>
      <Grid item xs={1}><Button variant="contained" size="medium">Submit</Button></Grid>
    </Grid>

    
  );
}
