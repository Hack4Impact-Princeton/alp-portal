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

type AdminDashboardProps = {
  account: AdminAccount;
  error: Error | null;
  driveDataProps:
  | {
    drive: BookDrive;
    shipments: Shipment[];
    volunteer: VolunteerAccount;
    reactivationReq: ReactivationRequest | null;
  }[]
  | null;
};
const fieldsToCheck = ["driveName", "driveCode", "organizer", "country"];

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
  account,
  error,
  driveDataProps,
}) => {
  if (error) return <h1>{`error: ${error}`}</h1>;
  if (!account)
    return (
      <Link href="../auth/login">
        Something went wrong. Please try to log in again
      </Link>
    );
  const [driveData, setDriveData] = useState<
    | {
      drive: BookDrive;
      shipments: Shipment[];
      volunteer: VolunteerAccount;
      reactivationReq: ReactivationRequest | null;
    }[]
    | null
  >(driveDataProps);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activateSidebarMinWidth, toggleActivateSidebarMinWidth] =
    useState(false);
  const [sidebarDriveDatum, setSideBarDriveData] = useState<{
    drive: BookDrive;
    shipments: Shipment[];
    volunteer: VolunteerAccount;
    reactivationReq: ReactivationRequest | null;
  } | null>(null);

  const drives = driveDataProps?.map((driveDatum) => driveDatum.drive);
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
              country: `${curBookDrive["Country Prefrence: Countries Name"]}`,
              status: 0,
              booksGoal: 1000,
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

  const removeReactivationReq = (driveCode: string) => {
    const foundDriveDatum = driveData?.find(
      (driveDatum) => driveDatum.drive.driveCode === driveCode
    );
    if (!foundDriveDatum) {
      console.error(`hmmm, couldn't find the drive with code ${driveCode}`);
      alert(`hmmm, couldn't find the drive with code ${driveCode}`);
      return;
    }
    if (!foundDriveDatum.reactivationReq) {
      console.error(
        `hmmm, there was no reactivation request found for the drive with driveCode ${driveCode}`
      );
      alert(
        `hmmm, there was no reactivation request found for the drive with driveCode ${driveCode}`
      );
      return;
    }
    const filteredDrives = driveData?.filter(
      (datum) => datum.drive.driveCode !== driveCode
    );
    setDriveData(filteredDrives ? filteredDrives : null);
    const editedCurrDrive = sidebarDriveDatum;
    if (!editedCurrDrive) {
      console.error(
        "attempting to access the current sidebar drive but it doesnt exist apparently"
      );
      alert(
        "attempting to access the current sidebar drive but it doesnt exist apparently"
      );
      return;
    }
    editedCurrDrive.reactivationReq = null;
    editedCurrDrive.drive.reactivationRequestId = undefined;
    setSideBarDriveData(editedCurrDrive);
  };
  const handleDriveNameClick = (params: GridCellParams) => {
    if (params.field === "driveName") {
      const preDriveName = params.value as string;
      const midDriveName = preDriveName.replace(/[^a-zA-Z0-9\s\p{P}]/gu, "");
      const driveName = midDriveName.trim();
      // Close the current sidebar (if any) before opening the new one
      if (
        sidebarDriveDatum &&
        driveName === sidebarDriveDatum.drive.driveName
      ) {
        closeSidebar();
        // console.log("closing the drive because we have a duplicate: ", driveName)
        return;
      }

      const sideDrive = driveData?.find(
        (driveDatum) => driveDatum.drive.driveName === driveName
      );
      if (!sideDrive) {
        alert("Something went wrong on our end. Try refreshing the page");
        return;
      }
      // tbh I don't know why this works
      openSidebar(sideDrive);
    }
  };

  const openSidebar = (sideDrive: {
    drive: BookDrive;
    shipments: Shipment[];
    volunteer: VolunteerAccount;
    reactivationReq: ReactivationRequest | null;
  }) => {
    setTimeout(() => {
      setSideBarDriveData(sideDrive);
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
      setSideBarDriveData(null);
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

  return (
    <>
      <AdminPageContainer
        fName={account.fname}
        currPage="dashboard"
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
              DASHBOARD
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="67"
              height="65"
              viewBox="0 0 67 65"
              fill="none"
              onClick={() => window.location.reload()}
              style={{ cursor: "pointer" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M58.2318 30.9165C58.0576 28.316 55.3593 26.8851 52.8828 27.6974C50.614 28.4416 49.3812 30.8298 49.2658 33.2147C49.0294 38.0981 46.3651 42.7562 41.7909 45.3332C34.7129 49.321 25.7424 46.8158 21.7547 39.7378C21.2681 38.8741 20.2578 38.3989 19.3158 38.7079L15.7623 39.8735C13.941 40.4709 12.9727 42.4855 13.9136 44.1555C20.3411 55.5641 34.8001 59.602 46.2086 53.1744C54.429 48.5431 58.8227 39.7418 58.2318 30.9165ZM11.0861 29.2468C10.6632 32.2674 13.7235 34.2536 16.6216 33.3029C18.5618 32.6665 19.8135 30.8478 20.3201 28.8697C21.2806 25.1194 23.711 21.7519 27.3501 19.7016C32.7856 16.6393 39.337 17.406 43.891 21.1322C45.4726 22.4263 47.5592 23.1549 49.5011 22.518C52.395 21.5687 53.687 18.1586 51.564 15.9749C44.2438 8.44537 32.5126 6.46302 22.9324 11.8605C16.2335 15.6346 12.0759 22.1779 11.0861 29.2468Z"
                fill="#5F5F5F"
              />
              <path
                d="M12.2871 36.4002C12.4325 35.1886 13.6197 34.3886 14.7973 34.7086L27.5498 38.1742C29.2022 38.6232 29.563 40.8058 28.143 41.7627L13.8155 51.4179C12.3955 52.3749 10.508 51.2211 10.712 49.521L12.2871 36.4002Z"
                fill="#5F5F5F"
              />
              <path
                d="M55.5213 22.6482C55.755 23.8459 54.871 24.9719 53.652 25.0291L40.4515 25.648C38.741 25.7283 37.7273 23.762 38.7847 22.4152L49.4539 8.82588C50.5114 7.47907 52.662 7.99725 52.99 9.67786L55.5213 22.6482Z"
                fill="#5F5F5F"
              />
            </svg>
          </Grid>
        </Grid>


        <Grid
          container
          spacing={2}
          sx={{
            height: "wrap-content",
            width: "90%",
            display: "flex",
            marginLeft: 20,
            flexDirection: "column",
            marginBottom: 2,
          }}
        >
          <QuickActionsTable
            driveData={driveData}
            drives={drives}
            setRowClassName={setRowClassName}
            handleDriveNameClick={handleDriveNameClick}
          />

        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            height: "wrap-content",
            width: "90%",
            marginLeft: 20,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CurrentDriveTable
            drives={drives}
            handleDriveNameClick={handleDriveNameClick}
            setRowClassName={setRowClassName}
          />
          <CompletedDriveTable
            drives={drives}
            handleDriveNameClick={handleDriveNameClick}
          />
          <Grid>
            <div>
              <h4 className="page-header mb-4">Upload a CSV</h4>
              <div className="mb-4">
                <input
                  type="file"
                  className="form-control"
                  onChange={changeHandler}
                />
              </div>
              <button
                onClick={handleUploadCSV}
                disabled={!uploaded}
                className="btn btn-primary"
              >
                {uploaded ? "Parse Different Drives" : "Parse Drives"}
              </button>
              <button
                onClick={uploadDrives}
                disabled={!uploaded}
                className="btn btn-primary"
              >
                Upload Bookdrives
              </button>
            </div>
          </Grid>
        </Grid>

        {sidebarDriveDatum && (
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
            <AdminSidebar
              email={account.email}
              updateBookDriveStatus={updateBookDriveStatus}
              driveData={sidebarDriveDatum}
              removeReactivationReq={removeReactivationReq}
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
    if (!account) throw new Error(`account with email ${session.user.email}`);
    getVolunteerAccountModel();
    const BookDriveModel: mongoose.Model<BookDrive> = getBookDriveModel();
    const ShipmentModel: mongoose.Model<Shipment> = getShipmentModel();
    const VolunteerAccountModel: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const ReactivationRequestModel: mongoose.Model<ReactivationRequest> =
      getReactivationRequestModel();
    const driveDataPromises: Promise<{
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
    // console.log(driveData)
    return {
      props: {
        error: null,
        account: JSON.parse(JSON.stringify(account)),
        driveDataProps: JSON.parse(JSON.stringify(driveData)),
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
