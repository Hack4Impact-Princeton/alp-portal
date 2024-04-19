import { getServerSession } from "next-auth/next";
import { NextPage } from "next/types";
import getAdminAccountModel, { AdminAccount } from "../../models/AdminAccount";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../../models/VolunteerAccount";
import getBookDriveModel, { BookDrive } from "../../models/BookDrive";
import mongoose from "mongoose";
import { authOptions } from "../api/auth/[...nextauth]";
import { GridCellParams, GridRowParams } from "@mui/x-data-grid";
import getShipmentModel, { Shipment } from "../../models/Shipment";
import React, { ChangeEvent } from "react";
import { BookDriveStatus } from "../../lib/enums";
import { useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import useClickOutside from "../../lib/useClickOutside";
import type { } from "@mui/x-data-grid/themeAugmentation";
import styles from "./adminTable.module.css";
import AdminSidebar from "../../components/AdminSidebar";
import getReactivationRequestModel, {
  ReactivationRequest,
} from "../../models/ReactivationRequest";
import CurrentDriveTable from "../../components/CurrentDriveTable";
import CompletedDriveTable from "../../components/CompletedDriveTable";
import QuickActionsTable from "../../components/QuickActionsTable";
import Link from "next/link";
import AdminPageContainer from "../../components/AdminPageContainer";
import { DSVRowString } from "d3-dsv";
import * as d3 from "d3";

import { Box, Button, Fab, IconButton, Modal, Popper } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ModeIcon from '@mui/icons-material/Mode';
import AdminTable from "../../components/admindir/AdminTable";
import AdminDirectorySidebar from "../../components/AdminDirectorySidebar";
import PromoteAdminSearchBar from "../../components/admindir/PromoteAdminSearchBar";

type AdminDashboardProps = {
  allAdmin: AdminAccount[];
  allVolunteers: VolunteerAccount[];
  account: AdminAccount;
  error: Error | null;
  /*driveDataProps:
  | {
    drive: BookDrive;
    shipments: Shipment[];
    volunteer: VolunteerAccount;
    reactivationReq: ReactivationRequest | null;
  }[]
  | null;*/
};
const fieldsToCheck = ["driveName", "driveCode", "organizer", "country", "email"];

type BookDriveT = {
  driveName: string;
  driveCode: string;
  organizer: string;
  email: string;
  startDate: Date;
  country: string;
  status: number;
  booksGoal: number;
  completedDate: Date;
  mailDate: Date;
  reactivationRequestId: number | null;
  gs: {
    fundraise: string;
    terms: boolean;
  };
  cb: {
    booksCurrent: number;
    updateFreq: number;
    lastUpdate: Date;
  };
  pts: {
    intFee: number;
    domFee: number;
    materials: {
      boxes: boolean;
      extraCardboard: boolean;
      tape: boolean;
      mailingLabels: boolean;
    };
  };
  fl: {
    isFinalized: boolean;
    shipments: any[];
  };
  [key: string]: string | number | boolean | null | Date | Record<string, any>;
};

type ErrorDriveMap = Map<number, string>;


function hasBlankFields(obj: BookDriveT, fieldsToCheck: string[]): string {
  for (const field of fieldsToCheck) {
    let value = obj[field];
    if (value === "" || value === null) {
      return field; // At least one blank field found
    }
  }
  return ""; // No blank fields found
}

const AdminDashboard: NextPage<AdminDashboardProps> = ({
  allAdmin,
  allVolunteers,
  account,
  error,
  //driveDataProps,
}) => {
  if (error) return <h1>{`error: ${error}`}</h1>;
  if (!account)
    return (
      <Link href="../auth/login">
        Something went wrong. Please try to log in again
      </Link>
    );
/*  const [driveData, setDriveData] = useState<
    | {
      drive: BookDrive;
      shipments: Shipment[];
      volunteer: VolunteerAccount;
      reactivationReq: ReactivationRequest | null;
    }[]
    | null
  >(driveDataProps);*/
  const [showSidebar, setShowSidebar] = useState(false);
  const [activateSidebarMinWidth, toggleActivateSidebarMinWidth] =
    useState(false);
  const [sidebarDatum, setSideBarData] = useState<{
    adminName: string;
    affiliation: string;
    driveIds: string[];
    email: string;
    id: string;
    state: string;
  }| null>(null);

  //const drives = driveDataProps?.map((driveDatum) => driveDatum.drive);
  const [, setState] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bookDrives, setBookDrives] = useState<BookDriveT[]>([]); // Provide the correct initial type
  const [errorDriveMap, setErrorDriveMap] = useState(new Map());

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setSelectedFile(selectedFiles[0]);
      setUploaded(true);
    }
  };


  // go inside csv file and extract (for now) first book drive
  const handleUploadCSV = () => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const csvData: string | ArrayBuffer | null = event.target.result;

        // Use D3.js to parse the CSV data
        if (csvData !== null && typeof csvData === "string") {
          const parsedData = d3.csvParse(csvData);

          // Now you can work with the parsed data
          console.log(parsedData.length);

          const newBookDrives = parsedData.map(
            (
              curBookDrive: DSVRowString<string>,
              index: number,
              array: DSVRowString<string>[]
            ) => ({
              driveName: `${curBookDrive["Book Drive Name"]}`,
              driveCode: `${curBookDrive["Book Drive Code"]}`,
              organizer: `${curBookDrive["Contact: Full Name"]}`,
              email: `${curBookDrive["Contact Email"]}`,
              startDate: new Date(),
              country: `${curBookDrive["Country: Countries Name"]}`,
              status: 0,
              booksGoal: (curBookDrive["Book Drive Name"].endsWith('h drive'))?500:1000,
              completedDate: new Date(),
              mailDate: new Date(),
              reactivationRequestId: null,
              gs: {
                fundraise: "fundraise",
                terms: true,
              },
              cb: {
                booksCurrent: 0,
                updateFreq: 0,
                lastUpdate: new Date(),
              },
              pts: {
                intFee: 0,
                domFee: 0,
                materials: {
                  boxes: false,
                  extraCardboard: false,
                  tape: false,
                  mailingLabels: false,
                },
              },
              fl: {
                isFinalized: false,
                shipments: [],
              },
            })
          );
          setBookDrives(newBookDrives);
        }
      }
    };
    if (selectedFile) {
      const blob = new Blob([selectedFile], { type: "text/csv" });
      reader.readAsText(blob);
    }
    // reader.readAsText(selectedFile);
  };

  const uploadDrives = async () => {
    console.log("Uploading Drive to Mongo");
    setErrorDriveMap(new Map());
    for (let i = 0; i < bookDrives.length; i++) {
      // if any missing fields, don't upload drive and tell that there is an error
      const missingField = hasBlankFields(bookDrives[i], fieldsToCheck);
      if (missingField !== "") {
        setErrorDriveMap(
          (map) =>
            new Map(
              map.set(
                i,
                "The following information is missing: " + missingField
              )
            )
        );
        continue;
      }
      try {
        const response = await fetch(
          `/api/bookDrive/${bookDrives[i]["driveCode"]}`,
          {
            method: "POST",
            body: JSON.stringify(bookDrives[i]),
          }
        );

        if (response.ok) {
          console.log(
            `Uploaded book drive with code: ${bookDrives[i]["driveCode"]}`
          );
          // add to volunteer account
          const res = await fetch(`../api/volunteeraccounts/${bookDrives[i]["email"]}` ,{
            method: "GET"
          })
          if (!res.ok) continue; // no account found
          const account = await res.json().then(res => res.data);
          if (bookDrives[i]["driveCode"] in account.driveIds) continue;
          account.driveIds.push(bookDrives[i]["driveCode"])
          const resp = await fetch(`../api/volunteeraccounts/${bookDrives[i]["email"]}` ,{
            method: "PATCH",
            body: JSON.stringify(account)
          }).then(res => res.json())
        } else {
          setErrorDriveMap(
            (map) =>
              new Map(
                map.set(
                  i,
                  "check if the drive you are trying to input already exists " +
                  response.status
                )
              )
          );
        }
      } catch (e) {
        console.log(e);
      }
    }

  };
/*
  const updateBookDriveStatus = async (
    driveCode: string,
    status: number
  ): Promise<void> => {
    try {
      const res = await fetch(`/api/bookDrive/${driveCode}`, {
        method: "PUT",
        body: JSON.stringify({ status: status }),
      });
      if (!res.ok) {
        alert("updating the status failed");
        throw new Error("updating the status failed");
      }
      const resJson = await res.json();
      // console.log(resJson.data)
      const modifiedDrive = driveData?.find(
        (driveDatum) => driveDatum.drive.driveCode === resJson.data.driveCode
      );
      if (!modifiedDrive)
        throw new Error("something went wrong - Internal Server Error");
      // console.log(modifiedDrive)
      modifiedDrive!.drive.status = status;
      setState((prev) => !prev);
      alert("drive marked as active successfully");
    } catch (e: Error | any) {
      console.error(e);
    }
  };
*/
  // const removeReactivationReq = (driveCode: string) => {
  //   const foundDriveDatum = driveData?.find(
  //     (driveDatum) => driveDatum.drive.driveCode === driveCode
  //   );
  //   if (!foundDriveDatum) {
  //     console.error(`hmmm, couldn't find the drive with code ${driveCode}`);
  //     alert(`hmmm, couldn't find the drive with code ${driveCode}`);
  //     return;
  //   }
  //   if (!foundDriveDatum.reactivationReq) {
  //     console.error(
  //       `hmmm, there was no reactivation request found for the drive with driveCode ${driveCode}`
  //     );
  //     alert(
  //       `hmmm, there was no reactivation request found for the drive with driveCode ${driveCode}`
  //     );
  //     return;
  //   }
  //   const filteredDrives = driveData?.filter(
  //     (datum) => datum.drive.driveCode !== driveCode
  //   );
  //   setDriveData(filteredDrives ? filteredDrives : null);
  //   const editedCurrDrive = sidebarDriveDatum;
  //   if (!editedCurrDrive) {
  //     console.error(
  //       "attempting to access the current sidebar drive but it doesnt exist apparently"
  //     );
  //     alert(
  //       "attempting to access the current sidebar drive but it doesnt exist apparently"
  //     );
  //     return;
  //   }
  //   editedCurrDrive.reactivationReq = null;
  //   editedCurrDrive.drive.reactivationRequestId = undefined;
  //   setSideBarDriveData(editedCurrDrive);
  // };
  const handleDriveNameClick = (params: GridCellParams) => {
    console.log("in drivename click")
    if (params.field === "adminName") {
      const driveName = params.value as string;
      console.log(driveName)
      if (
        sidebarDatum &&
        driveName === sidebarDatum.adminName
      ) {
        closeSidebar();
        // console.log("closing the drive because we have a duplicate: ", driveName)
        return;
      }
      const adminProfile = {
        adminName: params.row.adminName,
        affiliation: params.row.affiliation,
        driveIds: ['test'],
        email: params.row.email,
        id: params.row.id,
        state: params.row.state
      }
//      console.log(params, driveData, adminProfile, "this!")

      if (!adminProfile) {
        alert("Something went wrong on our end. Try refreshing the page");
        return;
      }
      // tbh I don't know why this works
      openSidebar(adminProfile);
    }
  };

  const openSidebar = (adminProfile: {
    adminName: string;
    affiliation: string;
    driveIds: string[];
    email: string;
    id: string;
    state: string;
  }) => {
    setTimeout(() => {
      setSideBarData(adminProfile);
      setShowSidebar(true);
    }, 250); // Adjust the delay as needed
    setTimeout(() => {
      toggleActivateSidebarMinWidth(true);
    }, 400);
  };

  const closeSidebar = () => {
    toggleActivateSidebarMinWidth(false);
    setShowSidebar(false);
    setTimeout(() => {
      setSideBarData(null);
    }, 240); // Delayed reset after closing
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useClickOutside(sidebarRef, closeSidebar);

  const setRowClassName = (params: GridRowParams) => {
    if (params.row.status === BookDriveStatus.Cancelled)
      return styles["cancelled-row"];
    else if (params.row.id === "header") return styles["header-row"];
    // this never works I don't know where to set the header row
    else return "";
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleFABClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const [name, updateName] = useState(account.fname + " " + account.lname)
  const [adminState, updateAdminState] = useState(account.state)
  const [adminCity, updateAdminCity] = useState(account.city)
  const [affiliation, updateAffiliation] = useState(account.affiliation)

  const[showSearch, setShowSearch] = useState(false)
  const[filteredVolunteers, setFilteredVolunteers] = useState(allVolunteers.filter(volunteer => !allAdmin.some(admin => admin.email === volunteer.email)))
  const[updatedAdmin, setUpdatedAdmin] = useState(allAdmin)

  const handleNewAdmin = () => {
    setFilteredVolunteers(filteredVolunteers.filter(volunteer => !updatedAdmin.some(admin => admin.email === volunteer.email)));
  }


  return (
    <>
      <AdminPageContainer
        fName={account.fname}
        currPage="directory"
      ></AdminPageContainer>
      <Grid sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Grid sx={{ marginBottom: 3, width: "100%", marginLeft: 20 }}>
          <Grid
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <h1
              style={{
                color: "#5F5F5F",
                marginRight: 10,
                fontSize: 90,
                fontWeight: 600,
              }}
            >
              DIRECTORY
            </h1>
          </Grid>
          <Grid display="flex" alignItems={"center"} marginTop={3}>
            <h1 
            style={{
                color: "#FE9834",
                marginRight: 10,
                fontSize: 40,
                fontWeight: 600,
              }}
            >
                About You
            </h1>
            <IconButton sx={{backgroundColor: "#FE9834"}}>
                <ModeIcon sx={{color: "white"}}/>
            </IconButton>
        </Grid>
        <Grid marginTop={2}>
            <div style={{border:"1.5px solid #C9C9C9", backgroundColor: "#F5F5F5", width:"50%", padding: 20, borderRadius: "5px"}}>
                <p>{name} | {adminCity}, {adminState} | {affiliation}</p>
            </div>
        </Grid>
        <Grid display="flex" alignItems={"center"} marginTop={3}>
            <h1 
            style={{
                color: "#FE9834",
                marginRight: 10,
                fontSize: 40,
                fontWeight: 600,
              }}
            >
                All Admin
            </h1>
           { account.isSuperAdmin == true && <div><Button 
                    onClick={() => setShowSearch(true)}
                    sx={{ padding: 2, cursor: "pointer", height:"40px",fontFamily:"Epilogue",
                    fontWeight:"bold",color:"#5F5F5F",textTransform: 'none',outline:"none",backgroundColor:"#F3D39A",fontSize:"100%"
                  }} >
                <p>Promote New Admin</p>
            </Button> 
            <Modal open={showSearch} onClose={() => setShowSearch(false)}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", padding: "20px", width: "40vw" }}>
                    <PromoteAdminSearchBar users={filteredVolunteers} admins={allAdmin}/>
                </div>
           </Modal>
            </div>}
        </Grid>
        </Grid>
        

        <Grid
          container
          spacing={2}
          sx={{
            height: "wrap-content",
            width: "100%",
            display: "flex",
            marginLeft: 20,
            flexDirection: "column",
            marginBottom: 2,
            marginTop: 1,
          }}
        >
          <AdminTable
            allAdmin={allAdmin}
            //drives={drives}
            handleDriveNameClick={handleDriveNameClick}
            setRowClassName={setRowClassName}
          />

        </Grid>


        {sidebarDatum && (
          <div
            ref={sidebarRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              overflowY: showSidebar ? "scroll" : "hidden",
              background: "#F5F5F5",
              padding: "15px",
              boxSizing: "border-box",
              transformOrigin: "top right",
              transform: "scale(1)",
              transition: "width .23s ease",
              width: showSidebar ? "36%" : 0,
              minWidth: activateSidebarMinWidth ? "400px" : 0,
            }}
          >
            <AdminDirectorySidebar
              adminProfile={sidebarDatum}
              
            />
          </div>
        )}
      </Grid>

    </>
  );
};

export default AdminDashboard;

export const getServerSideProps = async (context: any) => {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    // console.log("session obj", session)
    if (!session || session.user?.name != "true") {
      return {
        redirect: {
          destination: "../auth/login",
          permanent: false,
        },
      };
    }

    const AdminAccountModel: mongoose.Model<AdminAccount> =
      getAdminAccountModel();
    const account: AdminAccount = (await AdminAccountModel.findOne({
      email: session.user.email,
    })) as AdminAccount;
    
    const allAdmin: AdminAccount[] = (await AdminAccountModel.find(
        {}
      )) as AdminAccount[];

    if (!account) throw new Error(`account with email ${session.user.email}`);
    getVolunteerAccountModel();
    const BookDriveModel: mongoose.Model<BookDrive> = getBookDriveModel();
    const ShipmentModel: mongoose.Model<Shipment> = getShipmentModel();
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const ReactivationRequestModel: mongoose.Model<ReactivationRequest> =
      getReactivationRequestModel();

    const allVolunteers: VolunteerAccount[] = (await VolunteerAccount.find(
        {}
    )) as VolunteerAccount[];
    
  /*  const driveDataPromises: Promise<{
      drive: BookDrive;
      shipments: Shipment[];
      volunteer: VolunteerAccount;
      reactivationReq: ReactivationRequest | null;
    }>[] = account.driveIds.map(async (driveId) => {
      const drive = (await BookDriveModel.findOne({
        driveCode: driveId,
      })) as BookDrive;
      if (!drive) throw new Error(`no bookdrive found with code ${driveId}`);
      const shipmentPromises = drive.fl.shipments.map(
        async (shipmentId) => await ShipmentModel.findById(shipmentId)
      );
      const shipments = (await Promise.all(shipmentPromises)) as Shipment[];
      const volunteer = (await VolunteerAccountModel.findOne({
        fname: drive.organizer.split(" ")[0],
        lname: drive.organizer.split(" ")[1],
      })) as VolunteerAccount;
      if (!volunteer)
        throw new Error(`no volunteer found with name ${drive.organizer}`);
      if (!drive.reactivationRequestId)
        return {
          drive: drive,
          shipments: shipments,
          volunteer: volunteer,
          reactivationReq: null,
        };
      const reactivationRequest = (await ReactivationRequestModel.findOne({
        id: drive.reactivationRequestId,
      })) as ReactivationRequest;
      return {
        drive: drive,
        shipments: shipments,
        volunteer: volunteer,
        reactivationReq: reactivationRequest,
      };
    });
    const driveData = await Promise.all(driveDataPromises);
    // console.log(driveData)*/
    return {
      props: {
        error: null,
        account: JSON.parse(JSON.stringify(account)),
        allVolunteers: JSON.parse(JSON.stringify(allVolunteers)),
        allAdmin: JSON.parse(JSON.stringify(allAdmin)),
      },
    };
  } catch (e: Error | any) {
    console.log(e);
    const errorStr =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;
    return {
      props: {
        error: errorStr,
        account: null,
        volunteers: null,
        driveData: null,
      },
    };
  }
};
