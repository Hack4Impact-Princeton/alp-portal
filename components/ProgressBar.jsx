import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';

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
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
            <BorderLinearProgress variant="determinate" value={props.progress/props.drivesize} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.progress,
        )}/1000`}</Typography>
            </Box>
        </Box>
        
    );
  }