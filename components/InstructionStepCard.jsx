import { Typography, Grid } from "@mui/material";

export default function InstructionStepCard({
  heading,
  subHeading,
  submitBtn,
  stepNum
}) {
  return (
    <Grid
      sx={{
        border: "2px solid black;",
        paddingLeft: "0.7em;",
        paddingRight: "0.7em;",
      }}
      container
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          <span
            style={{
              fontStyle: "italic",
              backgroundColor: "orange",
              paddingLeft: "5px",
              paddingRight: "1em",
            }}
          >
            {heading}
          </span>
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
      <span>{submitBtn}</span>

    </Grid>

  );
}
