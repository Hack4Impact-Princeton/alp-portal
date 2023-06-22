import React, { useState } from "react";
import { Typography, Grid, TextField, Button } from "@mui/material";

export default function InstructionInputCard({ heading, subHeading, submitBtn, stepNum }) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    console.log(`Typed => ${event.target.value}`);
    setValue(event.target.value);
  };

  return (
    <Grid
      sx={{
        border: "3px solid black",
        borderRadius: "5px",
      }}
      container
      direction="row"
      spacing={3}
      minWidth="50%"
      backgroundColor="#F5F5F5"
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          <span>How are you fundraising</span>
        </Typography>
        <Typography display="block"> </Typography>
        <Typography variant="h6">
          <span>See fundraising ideas here</span>
        </Typography>
      </Grid>

      <CardBody value={value} handleChange={handleChange} />
    </Grid>
  );
}

function CardBody({ value, handleChange }) {
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
    <Grid item xs={12} sx={{ pb: 3 }}>
      <TextField
        value={value}
        multiline
        rows={5} // Adjust the number of rows to make the box taller
        fullWidth
        id="books-collected"
        variant="outlined"
        onChange={handleChange}
      />
    </Grid>

    <Grid item xs={11}>
      <Button variant="contained" size="medium">
        Submit
      </Button>
    </Grid>
  </Grid>
);
}
