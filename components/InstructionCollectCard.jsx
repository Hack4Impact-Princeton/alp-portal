import { Typography, Grid, TextField, Button } from "@mui/material";
import React, {useState} from "react";

export default function CollectBooksCard({
  heading,
  subHeading,
  submitBtn,
  stepNum,
  numBooksCollected,
  driveCode,
  driveStatus
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
      
      <CardBody currBooks={numBooksCollected} driveCode={driveCode} info={driveStatus.collectingBooks} />
    </Grid>
  );
}

function CardBody(props) {
  const [bookState, setBookState] = useState("");
  const [currBooks, setCurrBooks] = useState(props.currBooks);

  const handleInput = e => {

    setBookState(e.target.value);
    console.log(bookState);
  }

  const handleSubmitButton = async () => {
    console.log("submit clicked");
    
    console.log(bookState);
    console.log(typeof(bookState));
    console.log(typeof(props.currBooks));
    try {

      const data = {
        cb: {
          booksCurrent: parseInt(currBooks) + parseInt(bookState),
          updateFreq: props.info.updateFreq++,
          lastUpdate: "6/14/23"  // implement datetime
        }
      }
      await fetch(`/api/bookDrive/${props.driveCode}`,{
        method: "PUT",
        body: JSON.stringify(data), // textfield information
      });
      console.log("submitted to DB");
    } catch (e) {
      console.error(e);
    }
    setCurrBooks(parseInt(currBooks)+parseInt(bookState));
    setBookState("");
  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={4} sx={{ pb: 5 }}>
        <span>Number of New Books Collected:</span>
      </Grid>
      <Grid item xs={8} sx={{ pb: 5 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={bookState} onChange={handleInput}/>
      </Grid>

      <Grid item xs={11}>
        <span>Please update every X weeks. Last updated 00/00/0000</span>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" size="medium" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
    </Grid>

    
  );
}