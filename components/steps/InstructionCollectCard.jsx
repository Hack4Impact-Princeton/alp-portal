import { Typography, Grid, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import UndoButton from '../UndoButton'
export default function InstructionCollectCard({
  stepNum,
  driveCode,
  driveStatus
}) {
  let cardContent = <></>;


  switch (stepNum) {
    case 2: // check what number this should be
      cardContent = <CollectBooksCard
        driveCode={driveCode}
        info={driveStatus.collectingBooks}>
      </CollectBooksCard>;

      break;
    case 3:
      cardContent = <CollectIntFeeCard
        driveCode={driveCode}
        info={driveStatus.prepareToShip}>
      </CollectIntFeeCard>;
      break;
    case 4:
      cardContent = <CollectDomFeeCard
        driveCode={driveCode}
        info={driveStatus.prepareToShip}>
      </CollectDomFeeCard>;
      break;
    case 6:
      cardContent = <CollectFinishLine
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
  const [currBooks, setCurrBooks] = useState(props.info.booksCurrent);
  const [lastBookUpdate, setLastBookUpdate] = useState(null)
  console.log(currBooks);

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
      setCurrBooks(parseInt(currBooks) + parseInt(bookState));
      setLastBookUpdate(parseInt(bookState))
      setBookState("");
    }
    else {
      console.log("not valid")
      setBookState("");
    }

  }

  const undoBookAdd = async () => {
    try {
      if (lastBookUpdate) {
        await fetch(`/api/bookDrive/${props.driveCode}`, { method: "PUT", body: JSON.stringify({ cb: { booksCurrent: (parseInt(currBooks) - lastBookUpdate) } }) })
        setCurrBooks(parseInt(currBooks) - lastBookUpdate)
      }
      setLastBookUpdate(null)
    } catch (e) {
      console.error(e)
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
        <Typography variant="h5"># New Books Collected:</Typography>
        <Typography variant="p">example: 100</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={bookState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", pb: 4 }}>
        <UndoButton undo={undoBookAdd} />
        <Button style={{ ...styles.btn, marginLeft: 7 }} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
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
  const [currFunds, setCurrFunds] = useState(props.info.intFee);
  const [lastFundUpdate, setLastFundUpdate] = useState(null)
  console.log(currFunds);
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
            domFee: props.info.domFee,
            materials: props.info.materials
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
      setCurrFunds(parseInt(currFunds) + parseInt(fundState));
      setLastFundUpdate(parseInt(fundState))
      setFundState("");
    }
    else {
      console.log("not valid")
      setFundState("");
    }


  }
  const undoAddFunds = async () => {
    try {
      console.log("lastFundUpdate", lastFundUpdate)
      if (lastFundUpdate) {
        await fetch(`/api/bookDrive/${props.driveCode}`, {
          method: "PUT",
          body: JSON.stringify({ pts: { intFee: (parseInt(currFunds) - lastFundUpdate) } })
        })
        setCurrFunds(parseInt(currFunds) - lastFundUpdate)
      }
      setLastFundUpdate(null)

    } catch (e) {
      console.error(e)
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
        <Typography variant="h5"># New Funds Collected:</Typography>
        <Typography variant="p">example: 50</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={fundState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", pb: 4 }}>
        <UndoButton undo={undoAddFunds} />
        <Button style={{ ...styles.btn, marginLeft: 5 }} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
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
  const [currFunds, setCurrFunds] = useState(props.info.intFee);
  const [lastFundUpdate, setLastFundUpdate] = useState(null)
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
            intFee: props.info.intFee,
            domFee: parseInt(currFunds) + parseInt(fundState),
            materials: props.info.materials
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
      setCurrFunds(parseInt(currFunds) + parseInt(fundState));
      setLastFundUpdate(parseInt(fundState))
      setFundState("");
    }
    else {
      console.log("not valid")
      setFundState("");
    }

  }

  const undoAddFunds = async () => {
    try {
      console.log("lastFundUpdate", lastFundUpdate)
      if (lastFundUpdate) {
        await fetch(`/api/bookDrive/${props.driveCode}`, {
          method: "PUT",
          body: JSON.stringify({ pts: { intFee: (parseInt(currFunds) - lastFundUpdate) } })
        })
        setCurrFunds(parseInt(currFunds) - lastFundUpdate)
      }
      setLastFundUpdate(null)

    } catch (e) {
      console.error(e)
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
        <Typography variant="h5"># New Funds Collected:</Typography>
        <Typography variant="p">example: 50</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" fullWidth id="books-collected" variant="outlined" value={fundState} onChange={handleInput} />
      </Grid>

      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", pb: 4 }}>
        <UndoButton undo={undoAddFunds} />
        <Button style={{ ...styles.btn, marginLeft: 5 }} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
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
  const [date, setDate] = useState(props.info.dateSent);
  const [books, setBooks] = useState(props.info.numBooks);
  const [boxes, setBoxes] = useState(props.info.numBoxes);

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
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Grid container alignItems="center" sx={{ p: 5 }}>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Date Sent:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }} s>
        <TextField size="small" fullWidth={false} id="date-sent" variant="outlined" value={date} onChange={handleInputDate} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Books Collected:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" id="books-collected" variant="outlined" value={books} onChange={handleInputBooks} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>

      <Grid item xs={11}>
      </Grid>

      <Grid item xs={4} sx={{ pb: 2 }}>
        <Typography variant="h5">Boxes Collected:</Typography>
      </Grid>
      <Grid item xs={8} sx={{ pb: 2 }}>
        <TextField size="small" id="boxes-collected" variant="outlined" value={boxes} onChange={handleInputBoxes} sx={{ pr: 5 }} />
        <Button style={styles.btn} variant="contained" size="large" onClick={handleSubmitButton}>Submit</Button>
      </Grid>
    </Grid>
  )
}
