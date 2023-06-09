// TO BE DEPRECATED
import { Typography, Grid, TextField } from "@mui/material";

export default function InstructionStepCard({
  heading,
  subHeading,
  submitBtn,
  stepNum,
  numBooksCollected,
}) {
  let HEADER_NUM;
  switch (stepNum) {
    case 1:
      HEADER_NUM = numBooksCollected
        ? numBooksCollected
        : "Must pass numBooksCollected!";
      break;
    case 2:
      HEADER_NUM = "($250)";
      break;
    case 3:
      HEADER_NUM = "($350-400)";
      break;
    default:
      HEADER_NUM = null;
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
          <span>{heading}</span> <span>{HEADER_NUM}</span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">{subHeading}</Typography>
      </Grid>

      <StepOneInstructions />

      {/*
        {
          '1': <StepOneInstructions />,
          '2': <StepTwoInstructions />,
          '3': <StepThreeInstructions />,
          '4': <StepFourInstructions />,
          '5': <StepFiveInstructions />,
          '6': <StepSixInstructions />,
          '7': <StepSevenInstructions />,
        }[{stepNum}]
      */}
      <div>{submitBtn}</div>
    </Grid>
  );
}

function StepOneInstructions() {
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={4} sx={{ pb: 5 }}>
        <span>Number of New Books Collected</span>
      </Grid>
      <Grid item xs={8} sx={{ pb: 5 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" />
      </Grid>
      <Grid item xs={12}>
        <span>Please update every X weeks. Last updated 00/00/0000</span>
      </Grid>
    </Grid>

    /* <Grid container alignItems="center" sx={{ border: "2px solid red" }}>
      <Grid item xs={4}>
        <span>Update Books Collected</span>
      </Grid>
      <Grid item xs={8}>
        <TextField id="books-collected" variant="outlined" />
      </Grid>
    </Grid> */
  );
}
