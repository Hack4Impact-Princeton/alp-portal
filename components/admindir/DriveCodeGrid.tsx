import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';



type Props = {
  bookDriveCodes: string[];
};




const DriveCodeGrid: React.FC<Props> = ({ bookDriveCodes }) => {
  return (
    <Grid container sx={{maxHeight:"7vh",overflowY:"scroll",padding:1}}>
      {bookDriveCodes.map((code, index) => (
        <Grid item md={4} key={index} textAlign={"center"}>
          <p>{code}</p>
        </Grid>
      ))}
    </Grid>
  );
};

export default DriveCodeGrid;