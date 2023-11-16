import * as React from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";

import Grid2 from "@mui/material/Unstable_Grid2";

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
  return (
    <Grid2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">State</TableCell>
              <TableCell align="right"># Drives</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {d.userName}
                </TableCell>
                <TableCell align="right">{d.userState}</TableCell>
                <TableCell align="right">{d.seasonalDrives}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2>
  );
};

export default LeaderTable;
