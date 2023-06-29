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
import InstructionStepCard from './InstructionStepCard';
import InstructionCollectCard from './InstructionCollectCard';
import InstructionChecklistCard from './InstructionChecklistCard';
import InstructionInputCard from './InstructionInputCard';


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
            <InstructionInputCard driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"How will you Fundraise?"} stepNum={0}> 
            </InstructionInputCard>
            <InstructionChecklistCard driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"Read the Book Collection Guidelines"} stepNum={1}></InstructionChecklistCard>;
          </Grid>
        </Grid>
        break;
      case 1: 
        content = 
        <Grid container direction="column">
          <Grid paddingTop={2}>
            <InstructionCollectCard driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={2}></InstructionCollectCard>;
          </Grid>
        </Grid>
        break;
      case 2:
        content = <Grid container direction="column">
          <Grid paddingTop={2}>
            <InstructionCollectCard driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={3}></InstructionCollectCard>;
          </Grid>
          <Grid paddingTop={2}>
            <InstructionCollectCard driveCode={props.driveCode} driveStatus={props.driveStatus} stepNum={4}></InstructionCollectCard>;
          </Grid>
          <Grid paddingTop={2}>
            <InstructionChecklistCard driveCode={props.driveCode} driveStatus={props.driveStatus} heading={"Gather Shipping Materials"} stepNum={5}></InstructionChecklistCard>;
          </Grid>
        </Grid>
        break;
      case 3: 
        content = <CollectBooksCard paddingTop={3} stepNum={1} numBooksCollected={500} heading={"Current Number of Books Collected:"}></CollectBooksCard>
    }
    return (
      <Grid>
        <Grid container paddingTop={2} spacing={2} xs={12} sx={{width:"65vw", backgroundColor:"gray"}}>
            <Grid container spacing={1} item xs={9} sx={{color:"#FE9834"}} direction="row">
              <Grid>
                <h1 onClick = {handleExpandClick}>
                  {props.header}
                </h1>
              </Grid>
              <Grid>
                <ExpandMoreIcon sx={{
                  visibility:visible,
                  transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                   onClick = {handleExpandClick}/>
              </Grid>
            </Grid>
            <Grid container paddingTop={1} item xs={3}>
              <Grid paddingTop={1.5} sx={{visibility:visible}}>
                <h3 >
                  Completed
                </h3>
              </Grid>
              <Grid>
                <DoneRoundedIcon fontSize="medium" sx={{visibility:visible}}></DoneRoundedIcon>
              </Grid>
            </Grid>
            <Grid container item xs={12} alignItems={"center"} justifyContent={"center"}>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Grid paddingTop={3} paddingLeft={4}>
                  {_switchContent()}
                  </Grid>
              </Collapse>
            </Grid>
        </Grid>
      </Grid>
    );
}
