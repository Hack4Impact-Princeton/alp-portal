import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



type Props = {
  errorDrives: Map<number, string>;
  
};

const styles = {
    row:{
        root: {
            height: '10px',
          },
    },
    cell:{
        height:"1vh",
        fontFamily:"Epilogue"
    }
}


const ErrorCodeGrid: React.FC<Props> = ({ errorDrives }) => {
  return (
    <Grid sx={{maxHeight:'20vh', overflowY:"scroll"}}>
    <TableContainer>
        <Table aria-label="error drives table">
        <TableHead>
            <TableRow>
            <TableCell align="center"><strong>Drive ID</strong></TableCell>
            <TableCell align="center"><strong>Missing Information</strong></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {[...errorDrives.entries()].map(([key, value]) => (
            <TableRow sx={styles.row} key={key}>
                <TableCell sx={styles.cell} align="center">{key}</TableCell>
                <TableCell sx={styles.cell} align="center">{value}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
  </TableContainer>
  </Grid>
  );
};

export default ErrorCodeGrid;