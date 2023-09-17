import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { getDriveNameCell } from "../lib/tableFns";
import { BookDrive } from "../models/BookDrive";
import { BookDriveStatus } from "../lib/enums";
import Grid from "@mui/material/Grid";
import UpCaret from "./UpCaret";
import DownCaret from "./DownCaret";
import useExpandableElement from "../lib/useExpandableElement";
import { ReactivationRequest } from "../models/ReactivationRequest";
import { VolunteerAccount } from "../models/VolunteerAccount";
import { Shipment } from "../models/Shipment";
const QuickActionsTable: React.FC<{
  driveData:
    | {
        drive: BookDrive;
        shipments: Shipment[];
        reactivationReq: ReactivationRequest | null;
        volunteer: VolunteerAccount;
      }[]
    | undefined
    | null;
  drives: BookDrive[] | undefined;
  setRowClassName: (params: GridRowParams) => string;
  handleDriveNameClick: (params: GridCellParams) => void;
}> = ({ driveData, drives, handleDriveNameClick, setRowClassName }) => {
  const {
    visible: showQuickActions,
    toggleVisibility: toggleQuickActions,
    elementRef: quickActionsRef,
    elementStyles: quickActionsStyles,
  } = useExpandableElement();

  if (!drives || !driveData)
    return (
      <Grid item display={"flex"} flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Quick Actions</h1>
        {!showQuickActions && <UpCaret onClick={toggleQuickActions} />}
        {showQuickActions && <DownCaret onClick={toggleQuickActions} />}
      </Grid>
    );
  const prelimReactivationReqColumns: GridColDef[] = [
    { field: "driveName", headerName: "Reactivation Requests", width: 300 },
  ];
  const prelimShipmentsPendingColumns: GridColDef[] = [
    { field: "driveName", headerName: "Shipments Pending", width: 300 },
  ];
  const prelimNotUpdatedInColumns: GridColDef[] = [
    { field: "driveName", headerName: "Not Updated in 10 Days", width: 300 },
  ];
  const reactivationReqColumns = prelimReactivationReqColumns.map((column) => {
    return {
      ...column,
      renderCell: (params: GridCellParams) => {
        const colDriveName = params.value as string;
        return getDriveNameCell(colDriveName, drives);
      },
    };
  });
  const shipmentsPendingColumns = prelimShipmentsPendingColumns.map(
    (column) => {
      return {
        ...column,
        renderCell: (params: GridCellParams) => {
          const colDriveName = params.value as string;
          return getDriveNameCell(colDriveName, drives);
        },
      };
    }
  );
  const notUpdatedInColumns = prelimNotUpdatedInColumns.map((column) => {
    return {
      ...column,
      renderCell: (params: GridCellParams) => {
        const colDriveName = params.value as string;
        return getDriveNameCell(colDriveName, drives);
      },
    };
  });
  // this is nice and easy but maybe it would be better to just make it so that it checks to see whether they have shipments that haven't been received yet
  const shipmentsPendingRows = drives
    ? drives
        .filter((drive) => drive.status === BookDriveStatus.Verifying)
        .map((drive) => {
          return { id: drive.driveCode, driveName: drive.driveName };
        })
    : [];

  const notUpdatedInRows = drives
    ? drives
        .filter(
          (drive) =>
            drive.status === BookDriveStatus.Active &&
            new Date().getTime() - new Date(drive.cb.lastUpdate).getTime() >
              10 * 24 * 60 * 60 * 1000
        )
        .map((drive) => {
          return { id: drive.driveCode, driveName: drive.driveName };
        })
    : [];
  // ❗🕔
  const reactivationReqRows = driveData
    ? driveData
        .filter((driveDatum) => driveDatum.reactivationReq !== null)
        .map((driveDatum) => {
          return {
            id: driveDatum.drive.driveCode,
            driveName: driveDatum.drive.driveName,
          };
        })
    : [];
  return (
    <>
      <Grid item display={"flex"} flexDirection="row" alignItems="center">
        <h1 style={{ color: "#FE9384" }}>Quick Actions</h1>
        {!showQuickActions && <UpCaret onClick={toggleQuickActions} />}
        {showQuickActions && <DownCaret onClick={toggleQuickActions} />}
      </Grid>
      <div ref={quickActionsRef} style={quickActionsStyles}>
        <Grid
          container
          spacing={2}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {notUpdatedInRows.length !== 0 && (
            <Grid item sx={{ width: "fit-content" }}>
              <DataGrid
                rows={notUpdatedInRows}
                columns={notUpdatedInColumns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10]}
                hideFooter
                checkboxSelection
                disableRowSelectionOnClick
                onCellClick={handleDriveNameClick}
                getRowClassName={setRowClassName}
              />
            </Grid>
          )}
          {shipmentsPendingRows.length !== 0 && (
            <Grid item sx={{ width: "fit-content" }}>
              <DataGrid
                rows={shipmentsPendingRows}
                columns={shipmentsPendingColumns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                hideFooter
                disableRowSelectionOnClick
                onCellClick={handleDriveNameClick}
                getRowClassName={setRowClassName}
              />
            </Grid>
          )}
          {reactivationReqRows.length !== 0 && (
            <Grid item sx={{ width: "fit-content" }}>
              <DataGrid
                rows={reactivationReqRows}
                columns={reactivationReqColumns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                hideFooter
                disableRowSelectionOnClick
                onCellClick={handleDriveNameClick}
                getRowClassName={setRowClassName}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default QuickActionsTable;
