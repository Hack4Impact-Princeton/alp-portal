import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';
import {useState, useEffect} from 'react'
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 17,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#D9D9D9',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#FE9834',
  },
}));

export default function ProgressBar(props) {
  console.log(props.drive)
  const books = props.drive.cb.booksCurrent
  const goal = props.drive.booksGoal
  console.log(books)
  console.log(goal)
  const [width, setWidth] = useState(90);
  
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth > 800 ? window.innerWidth/7 : window.innerWidth/9)); // adds event listener
    return () => {
      window.removeEventListener('resize', ()=> setWidth(window.innerWidth > 800 ? window.innerWidth/7 : window.innerWidth/9)); // removes event listener
    };
  });
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', flexGrow: 1}}>
      <Box sx={{ width: `${width}%`, mr: 1, ml: 1 }}>
        <BorderLinearProgress variant="determinate" value={(books / goal) * 100} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${books}/${goal}`}</Typography>
      </Box>
    </Box>

  );
}