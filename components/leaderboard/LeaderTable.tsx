import * as React from "react";
import { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import Grid2 from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import CircularIcon from "../CircularIcon";


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FE9834",
    color: "#F1F1F1",
    fontStyle: "bold",
    fontSize: 20,
    // borderRight: "1px solid #C9C9C9",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontColor: "#5F5F5F",
    //borderRight: "1px solid #C9C9C9",
  },
}));

type dataType = {
  userName: string;
  userState: string;
  totalDrives: number;
  seasonalDrives: number;
};
type TableProps = {
  data: dataType[];
  boardType: string;
};

const LeaderTable: React.FC<TableProps> = ({ data, boardType }) => {
  console.log(data);
  console.log(typeof data);


  // Take only the first 10 entries
  const slicedData = data.slice(0, 10);

  return (
    <Grid2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ fontStyle: "bold" }}>
              <StyledTableCell sx={{ width: "75px" }}>
                <h4>Rank</h4>
              </StyledTableCell>
              <StyledTableCell sx={{ width: "150px" }}>
                <h4>Name</h4>
              </StyledTableCell>
              <StyledTableCell align="center">
                <h4>State</h4>
              </StyledTableCell>
              <StyledTableCell align="center">
                <h4># Drives</h4>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((d, index) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={index}
              >
                <StyledTableCell component="th" scope="row">
                  <p>{index + 1}</p>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <p>{d.userName}</p>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <p>{d.userState}</p>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <p>
                    {" "}
                    {boardType == "seasonal" ? d.seasonalDrives : d.totalDrives}
                  </p>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2>
  );
};

export default LeaderTable;
