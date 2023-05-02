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
    const [expanded, setExpanded] = React.useState(!props.completed);
    
    let visible = (props.completed) ? "visible" : "hidden";
    
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
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
                    <InstructionStepCard paddingTop={3}></InstructionStepCard>
                  </Grid>
                  
              </Collapse>
            </Grid>
        </Grid>
      </Grid>
    );
}
