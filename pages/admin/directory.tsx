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



  const toggleShowEditProfileModal = (val: boolean) => {
    if (val) {
     // setName(`${currAccount.fname} ${currAccount!.lname}`)
      // setHobbies(currAccount.hobbies)
     // setAffiliation(currAccount.affiliation)
      editProfileRef?.current?.showModal()
    }
    else {
      editProfileRef?.current?.close()
      //setName(`${currAccount.fname} ${currAccount.lname}`)
     // setHobbies(currAccount.hobbies)
      //setAffiliation(currAccount.affiliation)
     // setFavBook(currAccount.favoriteBook)
    }

  }

  const editProfileRef = useRef<HTMLDialogElement>(null)

  const [currAccount, setCurrAccount] = useState(account)

  const editProfile = async () => {
    const nameArr = name.trim().split(" ")
    if (nameArr.length < 2) {
      alert("Enter a valid first and last name")
      return
    }
    setRole([])
    console.log(role)

    const update = {
      fname: nameArr[0],
      lname: nameArr[nameArr.length - 1],
      // location: location,
      affiliation: affiliation.trim(),
      role: role,
    }
    const newAccount: AdminAccount = {
      ...currAccount,
      ...update,
    }
    const res = await fetch(`/api/adminAccounts/${currAccount.email}`, {
      method: "PATCH",
      body: JSON.stringify(update)
    })
    if (!res.ok) {
      alert("profile modification failed")
      return
    }
    setCurrAccount(newAccount)

    toggleShowEditProfileModal(false)
  }


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

  // profile variables
  const [name, setName] = useState(account.fname + " " + account.lname)
  const [role, setRole] = useState(account.role)
  const [country, setCountry] = useState(account.country)
  const [state, setState] = useState(account.state)
  const [city, setCity] = useState(account.city)
  const [affiliation, setAffiliation] = useState(account.affiliation)



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
            <IconButton onClick={() => toggleShowEditProfileModal(true)} sx={{backgroundColor: "#FE9834"}}>
                <ModeIcon sx={{color: "white"}}/>
            </IconButton>
            <dialog
            ref={editProfileRef}
            style={{
              height: "50%",
              width: "40%",
              minHeight: "450px",
              borderRadius: "3%",
              paddingLeft: 3,
              paddingRight: 3,

              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#f5f5f5"
            }}
          >
            <Grid
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              alignItems={"center"}
              alignSelf={"flex-start"}
              height={"100%"}
              sx={{
                backgroundColor: "#F5F5F5",
                width: "100%",
                height: "100%",
              }}
            >
              <Grid
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"space-between"}
                width="100%"
                sx={{ marginTop: 1 }}
              >
                <p
                  style={{
                    color: "#5F5F5F",
                    fontWeight: 600,
                    fontSize: 20,
                    width: "90%",
                    marginLeft: "5%",
                  }}
                >
                  Edit Profile
                </p>
                <p style={{ cursor: "pointer", marginRight: 16, fontWeight: "600" }} onClick={() => toggleShowEditProfileModal(false)}>x</p>

              </Grid>
              <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-around", flexDirection: "row", width: "100%", alignItems: "center"}}>
             
                <div style={{ display: "flex", flexDirection: "column", width: "90%", flexShrink: 3, height: "100%", justifyContent: "space-around", alignItems: "start", }}>
                  <i style={{ marginLeft: 3, display: "flex", alignSelf: "flex-start", fontSize: 10 }}>Name</i>
                  <input type="text" placeholder={"name"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                  <i style={{ marginLeft: 3, display: "flex", alignSelf: "flex-start", fontSize: 10 }}>Role</i>
                  <input type="text" placeholder={"role"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value.split(", "))} />
                  <i style={{ marginLeft: 3, display: "flex", alignSelf: "flex-start", fontSize: 10 }}>Country</i>
                  <input type="text" placeholder={"role"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={country} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)} />
                  <i style={{ marginLeft: 3, display: "flex", alignSelf: "flex-start", fontSize: 10 }}>State</i>
                  <input type="text" placeholder={"role"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={state} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)} />
                  <i style={{ marginLeft: 3, display: "flex", alignSelf: "flex-start", fontSize: 10 }}>City</i>
                  <input type="text" placeholder={"role"} style={{ padding: "3px", width: "93%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} />
                  {/* <Dropdown options={states} setResult={setLocation} location={location} /> */}
                </div>
              </div>
              <div style={{ display: "flex", flex: 1,  marginTop: 10, flexDirection: "column", width: "100%", alignItems: "start", paddingLeft: "4%" }}>
                <i style={{ marginLeft: 3, fontSize: 10 }}>Affiliation</i>
                <input style={{ padding: 3, width: "96%", height: "36px", fontSize: 16, border: "1px solid #ccc", borderRadius: "4px" }} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAffiliation(e.target.value)} value={affiliation} />
              </div>
              <Grid
                display="flex"
                flexDirection="column"
                justifyContent="space-around"
                alignItems="center"
                height="wrap-content"
                sx={{ width: "100%", padding: 1, }}
              >
                <Button
                  sx={{
                    backgroundColor: "#FE9834",
                    "&:hover": { backgroundColor: "#D87800" },
                    fontWeight: 550,
                    color: "white",
                    width: "95%",
                    marginBottom: 1
                  }}
                  onClick={editProfile}
                >
                  Submit
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#5F5F5F",
                    "&:hover": { backgroundColor: "#777777" },
                    fontWeight: 550,
                    color: "white",
                    width: "95%"
                  }}
                  onClick={() => toggleShowEditProfileModal(false)}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </dialog>

        </Grid>
        <Grid marginTop={2}>
            <div style={{border:"1.5px solid #C9C9C9", backgroundColor: "#F5F5F5", width:"50%", padding: 20, borderRadius: "5px"}}>
                <p>{currAccount.fname} {currAccount.lname} | {currAccount.role} | {currAccount.city}, {currAccount.state} | {currAccount.affiliation}</p>
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
