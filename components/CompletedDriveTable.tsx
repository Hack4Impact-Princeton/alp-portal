import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { getDriveNameCell, fullDrive, halfDrive } from "../lib/tableFns";
import { BookDrive } from "../models/BookDrive";
import { BookDriveStatus } from "../lib/enums";
import Grid from "@mui/material/Grid";
import UpCaret from "./UpCaret";
import DownCaret from "./DownCaret";
import useExpandableElement from "../lib/useExpandableElement";

const CompletedDriveTable: React.FC<{
  drives: BookDrive[] | undefined;
  handleDriveNameClick: (params: GridCellParams) => void;
}> = ({ drives, handleDriveNameClick }) => {
  const {
    visible: showCompletedDrives,
    toggleVisibility: toggleShowCompletedDrives,
    elementRef: completedDriveTableRef,
    elementStyles: completedDriveTableStyles,
  } = useExpandableElement();
  if (!drives)
    return (
      <Grid item display="flex" flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Completed Drives</h1>
        {!showCompletedDrives && (
          <UpCaret onClick={toggleShowCompletedDrives} />
        )}
        {showCompletedDrives && (
          <DownCaret onClick={toggleShowCompletedDrives} />
        )}
      </Grid>
    );

  const prelimCompletedDrivesColumns: GridColDef[] = [
    { field: "driveName", headerName: "Drive Name", width: 300 },
    { field: "size", headerName: "Size", width: 40 },
    { field: "country", headerName: "Country", width: 175 },
    { field: "organizer", headerName: "Organizer", width: 150 },
    { field: "completedDate", headerName: "Completed", width: 120 },
  ];
  const completedDrivesColumns: GridColDef[] = prelimCompletedDrivesColumns.map(
    (column) => {
      return {
        ...column,
        renderCell: (params: GridCellParams) => {
          if (column.field === "driveName") {
            if (!drives) throw new Error("drives don't exist???");
            const colDriveName = params.value as string;
            return getDriveNameCell(colDriveName, drives);
          } else if (column.field === "size") {
            const val = params.value as number;
            if (val == 500) return halfDrive;
            else return fullDrive;
          } else if (column.field === "country")
            return (
              <span style={{ whiteSpace: "normal" }}>
                {params.value as string}
              </span>
            );
        },
      };
    }
  );
  const completedDrivesGridRows = drives
    ? drives
        .filter((drive) => drive.status === BookDriveStatus.Completed)
        .map((drive) => {
          return {
            id: drive.driveCode,
            driveName: drive.driveName,
            size: drive.booksGoal,
            country: drive.country,
            organizer: drive.organizer,
            completedDate: new Date(drive.completedDate).toLocaleDateString(),
          };
        })
    : [];
  if (completedDrivesGridRows.length === 0)
    return (
      <Grid item display="flex" flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Completed Drives</h1>
        {!showCompletedDrives && (
          <UpCaret onClick={toggleShowCompletedDrives} />
        )}
        {showCompletedDrives && (
          <DownCaret onClick={toggleShowCompletedDrives} />
        )}
      </Grid>
    );
  return (
    <>
      <Grid item display="flex" flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Completed Drives</h1>
        {!showCompletedDrives && (
          <UpCaret onClick={toggleShowCompletedDrives} />
        )}
        {showCompletedDrives && (
          <DownCaret onClick={toggleShowCompletedDrives} />
        )}
      </Grid>
      <div ref={completedDriveTableRef} style={completedDriveTableStyles}>
        {completedDrivesGridRows.length !== 0 && (
          <Grid item sx={{ width: "fit-content" }}>
            <DataGrid
              rows={completedDrivesGridRows}
              columns={completedDrivesColumns}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              //hideFooter
              disableRowSelectionOnClick
              onCellClick={handleDriveNameClick}
            />
          </Grid>
        )}
      </div>
    </>
  );
};
export default CompletedDriveTable;
