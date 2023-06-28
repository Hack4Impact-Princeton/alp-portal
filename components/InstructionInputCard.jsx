import React, { useState } from "react";
import { Typography, Grid, TextField, Button } from "@mui/material";

export default function InstructionInputCard(props) {
  console.log("Props", props);
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    console.log(`Typed => ${event.target.value}`);
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        gs: {
          fundraise: value,
          terms: true,
        },
      };
      console.log("data: ", JSON.stringify(data));
  
      const response = await fetch(`/api/bookDrive/${props.driveCode}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from MongoDB:", responseData);
      } else {
        console.error("Error response from API:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
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
          <span>{props.heading}</span>
        </Typography>
        <Typography display="block"> </Typography>
          <span>See fundraising ideas here</span>
        <Typography variant="h6">
          <span></span>
        </Typography>
      </Grid>

      <CardBody value={value} handleChange={handleChange} handleSubmit={handleSubmit} />
    </Grid>
  );
}

function CardBody({ value, handleChange, handleSubmit }) {
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
        <Button variant="contained" size="medium" onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}
