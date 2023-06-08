import { FormatBold } from "@mui/icons-material";
import { Typography, Grid, TextField, Button } from "@mui/material";

export default function CollectBooksCard({
  heading,
  subHeading,
  submitBtn,
  cardNum,
  numBooksCollected,
  numFunds
}) {
  let HEADER_NUM;
  let HEADING;
  let SUBHEADING;
  let LABEL;

  switch(cardNum) {
    case 1: 
      HEADER_NUM = numBooksCollected
      ? numBooksCollected
      : "Must pass numBooksCollected!";
      HEADING = "Current Number of Books Collected: ";
      LABEL = "Update Books Collected:";
      break;
    case 2: 
      HEADER_NUM = numFunds;
      HEADING = "International Shipping Funds Collected: $";
      SUBHEADING = "Goal: $250. Send to ALP Team - more info"
      LABEL = "Update Funds Collected:";
      break;
    case 3:
      HEADER_NUM = numFunds;
      HEADING = "Domestic Shipping Funds Collected: $";
      SUBHEADING = "Goal: $350-400"
      LABEL = "Update Funds Collected:";
      break;
    default:
      HEADER_NUM = null;
      LABEL = null;
  } 
      
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
          <span>{HEADING}</span> <span>{HEADER_NUM}</span>
        </Typography>
        <Typography variant="subtitle1" sx={{pl: 1}}>
          <span>{SUBHEADING}</span>
        </Typography>
      </Grid>
      <Grid container alignItems="center" sx={{ p: 4 }}>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight={"bold"}>
          <span>{LABEL}</span>
        </Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" />
      </Grid>

      <Grid item xs={10} sx={{ pt: 3 }}>
        <span>Please update every X weeks. Last updated 00/00/0000</span>
      </Grid>
      <Grid item xs={2}><Button variant="contained" size="medium" sx={{width: "10vw", backgroundColor:"#FE9834", color:"black"}} >Submit</Button></Grid>
    </Grid>
      

      
    </Grid>
  );
}

