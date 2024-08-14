import mongoose from "mongoose";
import Box from "@mui/material/Box";
import PageContainer from "../components/PageContainer";
import DriveCard from "../components/DriveCard";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import dbConnect from "../lib/dbConnect";
import getBookDriveModel, { BookDrive } from "../models/BookDrive";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../models/VolunteerAccount";
import { NextPage } from "next";
import { useState, useRef } from "react";
import sendReactivationReq, {
  deleteReactivationRequest,
  editReactivationRequest,
} from "../db_functions/reactivationReqFns";
import useDynamicPadding from "../lib/useDynamicPadding";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import getReactivationRequestModel, {
  ReactivationRequest,
} from "../models/ReactivationRequest";
import { TextField } from "@mui/material";
import CircularIIcon from "../components/CircularIIcon";
import getBroadcastModel, { Broadcast } from "../models/Broadcast";
import Footer from "../components/Footer";

const DashVolunteer: NextPage<{
  driveData: {
    drive: BookDrive | null;
    reactivationReq: ReactivationRequest | null;
  }[];
  broadcasts: Broadcast[];
  account: VolunteerAccount | null;
  error: Error | null;
  friendRequests: string[];
  allVolunteers: VolunteerAccount[];
}> = ({ driveData, account, error, broadcasts,friendRequests,allVolunteers }) => {
  console.log(account);
  const drives = driveData.map((driveDatum) => driveDatum.drive);
  console.log("drives", drives);
  const leftPaddingValue = useDynamicPadding(635, 775, "29vw", "20vw", "15vw");

  const [showReqInfo, setShowReqInfo] = useState(false);
  const [reactivationReqMessage, setReactivationReqMessage] = useState("");
  const newReqModalRef = useRef<HTMLDialogElement>(null);
  const [currDriveCode, setCurrDriveCode] = useState<string>("");
  const [editReq, setEditReq] = useState(false);
  const viewReqModalRef = useRef<HTMLDialogElement>(null);
  const [currReqId, setCurrReqId] = useState<string>("");
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const submitReq = async (isEdited: boolean, id?: string) => {
    try {
      const response = isEdited
        ? await editReactivationRequest(id!, reactivationReqMessage)
        : await sendReactivationReq(
            currDriveCode,
            account!.alp_id,
            reactivationReqMessage
          );
      if (!response.success) {
        if (id)
          throw new Error(
            "The reactivation request you're editing may have been accepted/rejected by an administrator. Please refresh the page and check your broadcast inbox"
          );
        throw new Error(response.error);
      }
      isEdited
        ? toggleModal(viewReqModalRef, false, "")
        : toggleModal(newReqModalRef, false, "");
      const datum = isEdited
        ? driveData.find(
            (driveDatum) =>
              driveDatum.drive?.reactivationRequestId ===
              response.reactivationReq?.id
          )
        : driveData.find(
            (driveDatum) =>
              driveDatum?.drive?.driveCode ===
              response.reactivationReq.driveCode
          );
      datum!.reactivationReq = response.reactivationReq;
      datum!.drive!.reactivationRequestId = response.reactivationReq.id;
      setReactivationReqMessage("");
      setCurrReqId("");
      isEdited
        ? alert("Successfully edited reactivation request")
        : alert("Successfully sent request");
    } catch (e: Error | any) {
      console.error(e);
      if ("message" in e) alert((e as any).message);
    }
  };
  const deleteReq = async (driveCode: string, reqId: string) => {
    try {
      const response = await deleteReactivationRequest(driveCode, reqId);
      if (!response.success)
        throw new Error(
          `Something went wrong - the reactivation request cannot be found. It is possible that an administrator either accepted or rejected it. Please reload the page and check your broadcast inbox. Also, ${response.error}`
        );
      deleteModalRef?.current?.close();
      toggleModal(viewReqModalRef, false, "");
      const datum = driveData.find(
        (driveDatum) =>
          driveDatum.drive?.reactivationRequestId ===
          response.reactivationReq?.id
      );
      datum!.reactivationReq = null;
      delete datum!.drive!.reactivationRequestId;
      setReactivationReqMessage("");
      setCurrReqId("");
      alert("Successfully deleted reactivation request");
    } catch (e: Error | any) {
      console.error(e);
      if ("message" in e) alert((e as any).message);
    }
  };

  const toggleModal = (
    ref: React.RefObject<HTMLDialogElement>,
    val: boolean,
    driveCode: string
  ) => {
    setCurrDriveCode(driveCode);
    setEditReq(false);
    if (val) ref?.current?.showModal();
    else ref?.current?.close();
  };
  const openViewReqModal = (
    reqId: string,
    driveCode: string,
    message: string
  ) => {
    setCurrReqId(reqId);
    setReactivationReqMessage(message);
    toggleModal(viewReqModalRef, true, driveCode);
  };
  const allowEdit = () => {
    setEditReq(true);
    setReactivationReqMessage(reactivationReqMessage);
  };

  if (account) {
    return (
      <Grid2>
        <PageContainer
          fName={account.fname}
          userEmail={account.email}
          currPage="dash-volunteer"
          broadcasts={broadcasts}
          friendRequests={friendRequests}
          allVolunteers={allVolunteers}
          admin = {account.admin}
        ></PageContainer>
        {/* Necessary box for padding the page body, no overlap with Navbar */}
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            pl: leftPaddingValue,
            pt: "5vh",
            pr: "5vw",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "25px",
              textAlign: "left",
              marginTop: "2vh",
              marginBottom: "2vh",
            }}
          >
            Active Drives
          </div>

          {driveData && (
            <Stack direction="column" justifyContent="center" spacing={6}>
              {driveData.map((driveDatum) => (
                <>
                  <DriveCard
                    drive={driveDatum.drive}
                    reqExists={driveDatum.reactivationReq ? true : false}
                    reactivationReq={driveDatum.reactivationReq}
                    openNewReqModal={() =>
                      toggleModal(
                        newReqModalRef,
                        true,
                        driveDatum.drive?.driveCode!
                      )
                    }
                    openViewReqModal={() =>
                      openViewReqModal(
                        driveDatum.reactivationReq!.id,
                        driveDatum.drive?.driveCode!,
                        driveDatum.reactivationReq!.message
                      )
                    }
                  ></DriveCard>
                </>
              ))}
            </Stack>
          )}

          <dialog
            ref={newReqModalRef}
            style={{
              height: "55%",
              width: "50%",
              borderRadius: "3%",
              padding: 0,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Grid2
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              alignItems={"center"}
              sx={{
                backgroundColor: "#F5F5F5",
                width: "100%",
                height: "100%",
                padding: 2,
              }}
            >
              <Grid2
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"space-between"}
                width="100%"
              >
                <p
                  style={{
                    marginBottom: "5px",
                    color: "#FE9834",
                    fontWeight: 600,
                    fontSize: 20,
                    width: "75%",
                    marginLeft: "10%",
                  }}
                >
                  Reactivation Request Message for {currDriveCode}
                </p>
                <Grid2
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  sx={{ width: "20%" }}
                >
                  <div
                    onMouseEnter={() => setShowReqInfo(true)}
                    onMouseLeave={() => setShowReqInfo(false)}
                    style={{ width: "wrap-content", height: "wrap-content" }}
                  >
                    <CircularIIcon
                      onMouseEnter={() => setShowReqInfo(false)}
                      onMouseLeave={() => setShowReqInfo(false)}
                    />
                  </div>
                  {showReqInfo && (
                    <div
                      style={{
                        height: "auto",
                        width: "50%",
                        padding: 3,
                        margin: 3,
                        zIndex: 200,
                        position: "absolute",
                        top: "20%",
                        left: "48%",
                        border: "1.5px solid black",
                        borderRadius: "3%",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <p style={{ fontSize: 13 }}>
                        Write a message to your container manager explaining why
                        you would like to request drive reactivation. Your
                        container manager can either accept, reject, or reply to
                        your request. You will receive a broadcast when a
                        decision has been made.
                      </p>
                    </div>
                  )}
                </Grid2>
              </Grid2>
              <TextField
                multiline
                autoFocus
                required
                placeholder="message"
                rows={7}
                value={reactivationReqMessage}
                sx={{
                  width: "85%",
                  marginBottom: "5px",
                  backgroundColor: "#FFFFFF",
                  color: "#FE9384",
                  borderColor: "#FE9834",
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReactivationReqMessage(e.target.value)
                }
              />
              <Grid2
                display="flex"
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{ width: "50%" }}
              >
                <Button
                  onClick={() => toggleModal(newReqModalRef, false, "")}
                  sx={{
                    backgroundColor: "#F3D39A",
                    "&:hover": { backgroundColor: "#D3A874" },
                    fontWeight: 550,
                    color: "#5F5F5F",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => submitReq(false)}
                  sx={{
                    backgroundColor: "#F3D39A",
                    "&:hover": { backgroundColor: "#D3A874" },
                    fontWeight: 550,
                    color: "#5F5F5F",
                  }}
                >
                  Submit
                </Button>
              </Grid2>
            </Grid2>
          </dialog>

          <dialog
            ref={viewReqModalRef}
            style={{
              height: "55%",
              width: "50%",
              borderRadius: "3%",
              padding: 0,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Grid2
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              alignItems={"center"}
              sx={{
                backgroundColor: "#F5F5F5",
                width: "100%",
                height: "100%",
                padding: 2,
              }}
            >
              <p
                style={{
                  marginBottom: "2px",
                  color: "#FE9834",
                  fontWeight: 600,
                  fontSize: 20,
                }}
              >
                Reactivation Request Message for {currDriveCode}
              </p>
              {editReq && currReqId && (
                <TextField
                  multiline
                  autoFocus
                  required
                  placeholder="message"
                  value={reactivationReqMessage}
                  rows={8}
                  sx={{
                    width: "85%",
                    marginBottom: "5px",
                    backgroundColor: "#FFFFFF",
                    color: "#FE9384",
                    borderColor: "#FE9834",
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setReactivationReqMessage(e.target.value)
                  }
                />
              )}
              {!editReq && currReqId && (
                <Grid2
                  sx={{
                    width: "85%",
                    height: "85%",
                    backgroundColor: "#FFFFFF",
                    margin: 2,
                    padding: 2,
                    borderRadius: "3%",
                  }}
                >
                  <p>{reactivationReqMessage}</p>
                </Grid2>
              )}
              <Grid2
                display="flex"
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{ width: "65%" }}
              >
                <Button
                  onClick={() => toggleModal(viewReqModalRef, false, "")}
                  sx={{
                    backgroundColor: "#F3D39A",
                    "&:hover": { backgroundColor: "#D3A874" },
                    fontWeight: 550,
                    color: "#5F5F5F",
                  }}
                >
                  Close
                </Button>
                {editReq && (
                  <Button
                    onClick={() => submitReq(true, currReqId)}
                    sx={{
                      backgroundColor: "#F3D39A",
                      "&:hover": { backgroundColor: "#D3A874" },
                      fontWeight: 550,
                      color: "#5F5F5F",
                    }}
                  >
                    Submit
                  </Button>
                )}
                {!editReq && (
                  <Button
                    onClick={allowEdit}
                    sx={{
                      backgroundColor: "#F3D39A",
                      "&:hover": { backgroundColor: "#D3A874" },
                      fontWeight: 550,
                      color: "#5F5F5F",
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteModalRef?.current?.showModal()}
                  sx={{
                    backgroundColor: "#AF0000",
                    "&:hover": { backgroundColor: "#990000" },
                    fontWeight: 550,
                    color: "#FFFFFF",
                  }}
                >
                  Delete Request
                </Button>
              </Grid2>
            </Grid2>
          </dialog>
          <dialog
            ref={deleteModalRef}
            style={{
              height: "55%",
              width: "50%",
              borderRadius: "3%",
              padding: 0,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Grid2
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F5F5F5",
                padding: 10,
              }}
            >
              <h2
                style={{
                  color: "#FE9384",
                  fontWeight: 600,
                  fontSize: 25,
                  textAlign: "center",
                }}
              >
                Are you sure you want to delete this reactivation request?
              </h2>
              <Grid2
                display="flex"
                flexDirection="row"
                width="80%"
                justifyContent="space-between"
              >
                <Button
                  onClick={() => deleteModalRef.current?.close()}
                  sx={{
                    backgroundColor: "#F3D39A",
                    "&:hover": { backgroundColor: "#D3A874" },
                    fontWeight: 550,
                    color: "#5F5F5F",
                  }}
                >
                  No, go back
                </Button>
                <Button
                  onClick={() => deleteReq(currDriveCode, currReqId)}
                  sx={{
                    backgroundColor: "#AF0000",
                    "&:hover": { backgroundColor: "#990000" },
                    fontWeight: 550,
                    color: "#FFFFFF",
                  }}
                >
                  Yes, Delete Request
                </Button>
              </Grid2>
            </Grid2>
          </dialog>
        </Box>
        <Footer/>
      </Grid2>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "100px",
        }}
      >
        <h1>{error?.message}</h1>
      </div>
    );
  }
};

export async function getServerSideProps(context: any) {
  try {
    await dbConnect();
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    console.log("SESSION OBJ: ", session);
    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    // if (session.user?.name == "true") {
    //   return {
    //     redirect: {
    //       destination: "/admin/dashboard",
    //       permanent: false,
    //     },
    //   };
    // }
    const email = session.user?.email;
    //let account: VolunteerAccount;
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const allVolunteers: VolunteerAccount[] = (await VolunteerAccount.find(
        {}
      )) as VolunteerAccount[];
    const account: VolunteerAccount = allVolunteers.find(
        (volunteer) => volunteer.email === session.user?.email
      ) as VolunteerAccount;
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const driveList = account.driveIds;
    const ReactivationRequestModel: mongoose.Model<ReactivationRequest> =
      getReactivationRequestModel();
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel();
    console.log(account.broadcasts);
    const bPromises = account.broadcasts.map((broadcastId) => {
      const res = Broadcast.findOne({ id: broadcastId });
      if (!res) console.log("the bad broadcastId is", broadcastId);
      else return res;
    });
    const broadcasts = (await Promise.all(bPromises)) as Broadcast[];
    const driveDataPromises: Promise<{
      drive: BookDrive;
      reactivationReq: ReactivationRequest | null;
    }>[] = driveList.map(async (driveId) => {
      const drive = (await BookDrive.findOne({
        driveCode: driveId,
      })) as BookDrive;
      if (!drive) throw new Error(`No drive found with code ${driveId}`);
      if (!drive.reactivationRequestId)
        return { drive: drive, reactivationReq: null };
      const reactivationReqPromise = await ReactivationRequestModel.findOne({
        id: drive.reactivationRequestId,
      });
      const reactivationReq = (await Promise.resolve(
        reactivationReqPromise
      )) as ReactivationRequest;
      return { drive: drive, reactivationReq: reactivationReq };
    });
    const driveData = await Promise.all(driveDataPromises);
    console.log("driveData", driveData);
    return {
      props: {
        driveData: driveData ? JSON.parse(JSON.stringify(driveData)) : null,
        broadcasts: JSON.parse(JSON.stringify(broadcasts)),
        account: JSON.parse(JSON.stringify(account)),
        friendRequests: JSON.parse(JSON.stringify(account.friendRequests)),
        allVolunteers: JSON.parse(JSON.stringify(allVolunteers)),

      },
    };
  } catch (e: Error | any) {
    console.log(e);
    let strError =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;
    return { props: { error: strError } };
  }
}

export default DashVolunteer;
