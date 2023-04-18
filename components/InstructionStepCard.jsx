import { Typography, Grid } from "@mui/material";

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
        border: "2px solid black;",
      }}
      container
      spacing={4}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          <span>{heading}</span> <span>{HEADER_NUM}</span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">{subHeading}</Typography>
      </Grid>

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
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <span className="float-end">{submitBtn}</span>
      </Grid>
    </Grid>
  );
}
