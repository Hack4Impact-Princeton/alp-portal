import { Typography, Grid, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function InstructionCollectCard({
  stepNum,
  driveCode,
  driveStatus, booksGoal, updateCompleted, domFee, intFee, updateDomFee, updateIntFee, materials, updateNumBooks, numBooks
}) {
  let cardContent = <></>;


  switch (stepNum) {
    case 2: // check what number this should be
      cardContent = <CollectBooksCard
        numBooks={numBooks}
        updateNumBooks={updateNumBooks}
        booksGoal={booksGoal}
        updateCompleted={updateCompleted}
        driveCode={driveCode}
        info={driveStatus.collectingBooks}>
      </CollectBooksCard>;

      break;
    case 3:
      cardContent = <CollectIntFeeCard
        materials={materials}
        domFee={domFee}
        intFee={intFee}
        updateIntFee={updateIntFee}
        updateCompleted={updateCompleted}
        driveCode={driveCode}
        info={driveStatus.prepareToShip}>
      </CollectIntFeeCard>;
      break;
    case 4:
      cardContent = <CollectDomFeeCard
        materials={materials}
        domFee={domFee}
        updateDomFee={updateDomFee}
        intFee={intFee}
        updateCompleted={updateCompleted}
        driveCode={driveCode}
        info={driveStatus.prepareToShip}>
      </CollectDomFeeCard>;
      break;
    case 6:
      cardContent = <CollectFinishLine
        numBooks={numBooks}
        booksGoal={booksGoal}
        updateCompleted={updateCompleted}
        driveCode={driveCode}
        info={driveStatus.finishLine}>
      </CollectFinishLine>;
      break;
    default:
    // return error ?
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
      {cardContent}
    </Grid>
  );
}

function CollectBooksCard(props) {
  const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "5vw"
    },
  }
  const [bookState, setBookState] = useState("");
  const [currBooks, setCurrBooks] = useState(props.numBooks);

  useEffect(() => {
    if (currBooks >= props.booksGoal) props.updateCompleted(2, true)
  }, [currBooks])
  const handleInput = e => {
    setBookState(e.target.value);
    console.log(bookState);
    console.log(typeof (bookState))
  }

  const handleSubmitButton = async () => {
    console.log("submit clicked");
    if (parseInt(bookState) > 0 && parseInt(bookState) < 500) {
      try {

        const data = {
          cb: {
            booksCurrent: parseInt(currBooks) + parseInt(bookState),
            updateFreq: props.info.updateFreq++,
            lastUpdate: "6/20/23"  // implement datetime
          }
        }
        await fetch(`/api/bookDrive/${props.driveCode}`, {
          method: "PUT",
          body: JSON.stringify(data), // textfield information
        });
        console.log("submitted to DB");
      } catch (e) {
        console.error(e);
      }
      setCurrBooks((currVal) => currVal + parseInt(bookState));
      props.updateNumBooks(parseInt(bookState))
      setBookState("");
    }
    else {
      console.log("not valid")
      setBookState("");
    }

  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <Typography variant="h4">
          <span>Current Number of Books Collected:</span> <span>{currBooks}</span>
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Update Books Collected:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={bookState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ pb: 4 }}>
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
    </Grid>

  );
}

function CollectIntFeeCard(props) {
  const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "5vw"
    },
  }
  const [fundState, setFundState] = useState("");
  const [currFunds, setCurrFunds] = useState(props.intFee);
  useEffect(() => {
    if (currFunds >= 250) props.updateCompleted(3, true)
  }, [currFunds])

  const handleInput = e => {
    setFundState(e.target.value);
    console.log(fundState);
  }
  const handleSubmitButton = async () => {
    console.log("submit clicked");
    if (parseInt(fundState) > 0 && parseInt(fundState) < 500) {
      try {

        const data = {
          pts: {
            intFee: parseInt(currFunds) + parseInt(fundState),
            domFee: props.domFee,
            materials: props.materials
          }
        }
        await fetch(`/api/bookDrive/${props.driveCode}`, {
          method: "PUT",
          body: JSON.stringify(data), // textfield information
        });
        console.log("submitted to DB");
      } catch (e) {
        console.error(e);
      }
      setCurrFunds((currVal) => currVal + parseInt(fundState));
      props.updateIntFee(parseInt(fundState))
      setFundState("");
    }
    else {
      console.log("not valid")
      setFundState("");
    }


  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <Typography variant="h4">
          <span>International Shipping Fees Collected:</span> <span>$ {currFunds}</span>
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Update Funds Collected:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={fundState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ pb: 4 }}>
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
    </Grid>

  );
}

function CollectDomFeeCard(props) {
  const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "5vw"
    },
  }
  const [fundState, setFundState] = useState("");
  const [currFunds, setCurrFunds] = useState(props.domFee);
  useEffect(() => {
    if (currFunds >= 400) props.updateCompleted(4, true)
  }, [currFunds])

  const handleInput = e => {
    setFundState(e.target.value);
    console.log(fundState);
  }

  const handleSubmitButton = async () => {
    console.log("submit clicked");
    if (parseInt(fundState) > 0 && parseInt(fundState) < 500) {
      try {
        console.log("domFee:", currFunds)
        const data = {
          pts: {
            intFee: props.intFee,
            domFee: parseInt(currFunds) + parseInt(fundState),
            materials: props.materials
          }
        }
        console.log(data.pts.domFee)
        await fetch(`/api/bookDrive/${props.driveCode}`, {
          method: "PUT",
          body: JSON.stringify(data), // textfield information
        });
        console.log("submitted to DB");
      } catch (e) {
        console.error(e);
      }
      setCurrFunds((currVal) => currVal + parseInt(fundState));
      props.updateDomFee(parseInt(fundState))
      setFundState("");
    }
    else {
      console.log("not valid")
      setFundState("");
    }

  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <Typography variant="h4">
          <span>Domestic Shipping Fees Collected:</span> <span>$ {currFunds}</span>
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Update Books Collected:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={fundState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ pb: 4 }}>
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
    </Grid>

  );
}

function CollectFinishLine(props) {
  const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "5vw"
    },
  }
  const [date, setDate] = useState(props.info.dateSent ? null : "");
  const [books, setBooks] = useState(props.info.numBooks ? null : props.numBooks);
  const [boxes, setBoxes] = useState(props.info.numBoxes ? null : 0);

  const handleInputDate = e => {
    setDate(e.target.value);
    console.log(date);
  }


  const handleInputBooks = e => {
    setBooks(e.target.value);
    console.log(books);
  }

  const handleInputBoxes = e => {
    setBoxes(e.target.value);
    console.log(boxes);
  }


  const handleSubmitButton = async () => {
    console.log("submit clicked");
    try {
      const data = {
        fl: {
          dateSent: date,
          numBoxes: boxes,
          numBooks: books
        }
      }
      await fetch(`/api/bookDrive/${props.driveCode}`, {
        method: "PUT",
        body: JSON.stringify(data), // textfield information
      });
      console.log("submitted to DB");
      if (books > props.booksGoal && boxes > 0) props.updateCompleted(6, true)
      else props.updateCompleted(6, false)
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Date Sent:</Typography>
      </Grid>
      {date && <Grid item xs={8} sx={{ pb: 2 }} s>
        <TextField size="small" fullWidth={false} id="date-sent" variant="outlined" value={date} onChange={handleInputDate} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>}
      {!date &&
        <Grid item xs={8} sx={{ pb: 2 }}><h2>{props.info.dateSent}</h2></Grid>
      }

      <Grid item xs={11}>
      </Grid>

      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Books Collected:</Typography>
      </Grid>
      {books && <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" id="books-collected" variant="outlined" value={books} onChange={handleInputBooks} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>}
      {!books &&
        <Grid item xs={8} sx={{ pb: 2 }}><h2>{props.numBooks}</h2></Grid>
      }

      <Grid item xs={11}>
      </Grid>

      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Boxes Collected:</Typography>
      </Grid>
      {boxes && <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" id="boxes-collected" variant="outlined" value={boxes} onChange={handleInputBoxes} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>}
      {!boxes &&
        <Grid item xs={8} sx={{ pb: 2 }}><h2>{props.info.numBoxes}</h2></Grid>
      }

      <Grid item xs={11}>
      </Grid>
    </Grid>
  )
}
