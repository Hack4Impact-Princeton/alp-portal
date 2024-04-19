import {
    DataGrid,
    GridColDef,
    GridCellParams,
    GridRowParams,
  } from "@mui/x-data-grid";
  import { getDriveNameCell, fullDrive, halfDrive } from "../../lib/tableFns";
  import { BookDrive } from "../../models/BookDrive";
  import { BookDriveStatus } from "../../lib/enums";
  import Grid from "@mui/material/Grid";
  import UpCaret from "../UpCaret";
  import DownCaret from "../DownCaret";
  import useExpandableElement from "../../lib/useExpandableElement";
  import getAdminAccountModel, { AdminAccount } from "../../models/AdminAccount";


  const CurrentDriveTable: React.FC<{
    allAdmin: AdminAccount[];
   // drives: BookDrive[] | undefined;
    handleDriveNameClick: (params: GridCellParams) => void;
    setRowClassName: (params: GridRowParams) => string;
  }> = ({ allAdmin, handleDriveNameClick, setRowClassName }) => {

    const prelimCurrDrivesColumns: GridColDef[] = [
      { field: "adminName", headerName: "Name", width: 300 },
      { field: "state", headerName: "State", width: 100 },
      { field: "email", headerName: "Email", width: 300 },
    ];
  
    const currDrivesGridColumns: GridColDef[] = prelimCurrDrivesColumns.map(
      (column) => {
        return {
          ...column,
          renderCell: (params: GridCellParams) => {
            if (column.field === "driveName") {
          /*    if (!drives) throw new Error("drives don't exist???");
              const colDriveName = params.value as string;
              return getDriveNameCell(colDriveName, drives);*/
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
  
    const currDrivesGridRows = allAdmin.map((admin) => {
        console.log(admin)
      return {
        id: admin._id,
        adminName: admin.fname + " " + admin.lname,
        state: admin.state,
        email: admin.email,
        affiliation: admin.affiliation,
       // driveIds: admin.driveIds,
      };
    });
    if (currDrivesGridRows.length === 0) return <></>;
  
    return (
      <>

        <div>
          <Grid item sx={{ width: "fit-content" }}>
            <DataGrid
              rows={currDrivesGridRows}
              columns={prelimCurrDrivesColumns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10]}
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
  