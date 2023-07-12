import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import InstructionCollectCard from './InstructionCollectCard';
import InstructionChecklistCard from './InstructionChecklistCard';
import InstructionInputCard from './InstructionInputCard';
import { useState, useEffect } from 'react'

/*const ExpandMore = styled((props: (expand:boolean)) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));*/

export default function InstructionGroupCard(props) {
  // needs a prop for which group it is: 0, 1, 2, 3; this will determine what cards are created
  const [expanded, setExpanded] = React.useState(!props.completed);
  const [isCompleted, setCompleted] = React.useState(new Array(7).fill(false))
  const [domFee, setDomFee] = useState(props.driveStatus.prepareToShip.domFee)
  const [intFee, setIntFee] = useState(props.driveStatus.prepareToShip.intFee)
  const [materials, setMaterials] = useState(props.driveStatus.prepareToShip.materials)
  const [fundraise, setFundraise] = useState(props.driveStatus.gettingStarted.fundraise)
  const [terms, setTerms] = useState(props.driveStatus.gettingStarted.terms)
  const [numBooks, setNumBooks] = useState(props.driveStatus.collectingBooks.booksCurrent)
  const [dateSent, setDateSent] = useState(props.driveStatus.finishLine.dateSent)

  const updateNumBooks = (update) => {
    setNumBooks(prev => prev + update)
  }

  const updateDomFee = (update) => {
    setDomFee(prev => prev + update)
  }
  const updateIntFee = (update) => {
    setIntFee(prev => prev + update);
  }

  // useEffect(() =>{
  //   console.log("domFee", domFee, "intFee", intFee, "materials", materials)
  // }, [domFee, intFee, materials])

  // useEffect(() => {
  //   console.log("fundraise", fundraise, "terms", terms)
  // }, [fundraise, terms])

  // useEffect(() => {

  // }, [dateSent, numBooks])
  const updateCompleted = (index, value) => {
    setCompleted((prevState) => {
      const newState = [...prevState];
      newState[index] = value
      console.log(newState)

      return newState
    })
  }
  useEffect(() => {
    if (fundraise != "") updateCompleted(0, true)
    if (terms) updateCompleted(1, true)
    if (numBooks >= props.booksGoal) updateCompleted(2, true)
    if (intFee >= 250) updateCompleted(3, true)
    if (domFee >= 400) updateCompleted(4, true)
    const { mailingLabels, boxes, extraCardboard, tape } = materials
    if (mailingLabels && boxes && extraCardboard && tape) updateCompleted(5, true)
    if (numBooks >= props.booksGoal && dateSent && props.driveStatus.finishLine.numBoxes != 0) updateCompleted(6, true)
    // if (props.driveStatus.collectingBooks.booksCurrent >= props.driveStatus.)
    // 
  }, [])
  let visible = (props.completed) ? "visible" : "hidden";

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  let content = <></>
  switch (props.groupNum) {
    case 0:
      content =
        <Grid container direction="column">
          <Grid paddingTop={2}>
            <InstructionInputCard numBooks={numBooks} dateSent={dateSent} updateDateSent={setDateSent} terms={terms} fundraise={fundraise} setFundraise={setFundraise} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"How will you Fundraise?"} stepNum={0}>
            </InstructionInputCard>
            <InstructionChecklistCard terms={terms} setTerms={setTerms} fundraise={fundraise} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"Read the Book Collection Guidelines"} stepNum={1}></InstructionChecklistCard>;
          </Grid>
        </Grid>
      break;
    case 1:
      content =
        <Grid container direction="column">
          <Grid paddingTop={2}>
            <InstructionCollectCard numBooks={numBooks} updateNumBooks={updateNumBooks} booksGoal={props.booksGoal} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={2}></InstructionCollectCard>;
          </Grid>
        </Grid>
      break;
    case 2:
      content = <Grid container direction="column">
        <Grid paddingTop={2}>
          <InstructionCollectCard materials={materials} intFee={intFee} updateIntFee={updateIntFee} domFee={domFee} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={3}></InstructionCollectCard>;
        </Grid>
        <Grid paddingTop={2}>
          <InstructionCollectCard materials={materials} intFee={intFee} domFee={domFee} updateDomFee={updateDomFee} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={4}></InstructionCollectCard>;
        </Grid>
        <Grid paddingTop={2}>
          <InstructionChecklistCard materials={materials} setMaterials={setMaterials} intFee={intFee} domFee={domFee} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"Gather Shipping Materials"} stepNum={5}></InstructionChecklistCard>;
        </Grid>
      </Grid>
      break;
    case 3:
      content = <Grid container direction="column">
        <Grid paddingTop={2}>
          <InstructionCollectCard booksGoal={props.booksGoal} numBooks={numBooks} updateCompleted={updateCompleted} driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"Finish Line"} stepNum={6}>
          </InstructionCollectCard>
        </Grid>
      </Grid>
      break;
  }
  return (
    <Grid>
      <Grid container paddingTop={2} spacing={2} xs={12} sx={{ width: "65vw", backgroundColor: "gray" }}>
        <Grid container spacing={1} item xs={9} sx={{ color: "#FE9834" }} direction="row">
          <Grid>
            <h1 onClick={handleExpandClick}>
              {props.header}
            </h1>
          </Grid>
          <Grid>
            <ExpandMoreIcon sx={{
              visibility: visible,
              transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
              onClick={handleExpandClick} />
          </Grid>
        </Grid>
        <Grid container paddingTop={1} item xs={3}>
          <Grid paddingTop={1.5} sx={{ visibility: visible }}>
            <h3 >
              Completed
            </h3>
          </Grid>
          <Grid>
            <DoneRoundedIcon fontSize="medium" sx={{ visibility: visible }}></DoneRoundedIcon>
          </Grid>
        </Grid>
        <Grid container item xs={12} alignItems={"center"} justifyContent={"center"}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Grid paddingTop={3} paddingLeft={4}>
              {content}
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    </Grid>
  );
}
