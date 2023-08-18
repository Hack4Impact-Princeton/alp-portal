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
const CurrentDriveTable: React.FC<{
  drives: BookDrive[] | undefined;
  handleDriveNameClick: (params: GridCellParams) => void;
  setRowClassName: (params: GridRowParams) => string;
}> = ({ drives, handleDriveNameClick, setRowClassName }) => {
  const {
    visible: showCurrDrives,
    toggleVisibility: setShowCurrDrives,
    elementRef: currDriveTableRef,
    elementStyles: currDriveTableStyles,
  } = useExpandableElement();
  if (!drives) return <></>;
  const prelimCurrDrivesColumns: GridColDef[] = [
    { field: "driveName", headerName: "Drive Name", width: 300 },
    { field: "size", headerName: "Size", width: 40 },
    { field: "country", headerName: "Country", width: 175 },
    { field: "organizer", headerName: "Organizer", width: 150 },
    { field: "lastUpdated", headerName: "Last Updated", width: 120 },
  ];

  const currDrivesGridColumns: GridColDef[] = prelimCurrDrivesColumns.map(
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
  const currDrives = drives?.filter(
    (drive) =>
      drive.status === BookDriveStatus.Active ||
      drive.status === BookDriveStatus.Cancelled
  );

  const currDrivesGridRows = currDrives?.map((drive) => {
    return {
      id: drive.driveCode,
      driveName: drive.driveName,
      size: drive.booksGoal,
      country: drive.country,
      organizer: drive.organizer,
      lastUpdated: new Date(drive.cb.lastUpdate).toLocaleDateString(),
      status: drive.status,
    };
  });
  if (currDrivesGridRows.length === 0) return <></>;

  return (
    <>
      <Grid item display="flex" flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Current Drives</h1>
        {!showCurrDrives && <UpCaret onClick={setShowCurrDrives} />}
        {showCurrDrives && <DownCaret onClick={setShowCurrDrives} />}
      </Grid>
      <div ref={currDriveTableRef} style={currDriveTableStyles}>
        <Grid item sx={{ width: "fit-content" }}>
          <DataGrid
            rows={currDrivesGridRows}
            columns={currDrivesGridColumns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10]}
            checkboxSelection
            hideFooter
            disableRowSelectionOnClick
            onCellClick={handleDriveNameClick}
            getRowClassName={setRowClassName}
          />
        </Grid>
      </div>
    </>
  );
};
export default CurrentDriveTable;
