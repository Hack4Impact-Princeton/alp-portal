import { BookDrive } from "../models/BookDrive";
import { Shipment } from "../models/Shipment";
import { VolunteerAccount } from "../models/VolunteerAccount";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularIcon from "./CircularIcon";
import { BookDriveStatus } from "../lib/enums";
import { statusMap } from "../lib/enums";
//import { deadlineMap } from "../lib/enums";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Link from "next/link";
import { useState } from "react";
import UpCaret from "./UpCaret";
import DownCaret from "./DownCaret";
import { getStates } from "../lib/enums";
import useExpandableElement from "../lib/useExpandableElement";
import sendBroadcast from "../db_functions/sendBroadcast";
import MailOutlineIcon from '@mui/icons-material/MailOutline';import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaceIcon from '@mui/icons-material/Place';
import { EmailOutlined } from "@mui/icons-material";
import BadgeIcon from '@mui/icons-material/Badge';

const AdminDirectorySidebar: React.FC<{
  adminProfile: {
    adminName: string;
    affiliation: string;
    driveIds: string[];
    email: string;
    id: string;
    state: string;
  };
  
}> = ({ adminProfile }) => {
  // const { drive, shipments, volunteer, reactivationReq } = driveData;
  // const { status, organizer, driveName, driveCode, country, booksGoal, cb } = drive;
  // const [showReactivationReq, setShowReactivationReq] = useState(false)
  const [, setState] = useState(false);
  const {
    visible: showReactivationReq,
    toggleVisibility: toggleShowReactivationReq,
    elementRef: reactivationReqRef,
    elementStyles: reactivationReqStyles,
  } = useExpandableElement({ extraHeight: 10 });
  const {
    visible: showUpdateHistory,
    toggleVisibility: toggleShowUpdateHistory,
    elementRef: showUpdateHistoryRef,
    elementStyles: showUpdateHistoryStyles,
  } = useExpandableElement({ extraHeight: 10 });

//   const markShipmentReception = async (id: number) => {
//     try {
//       const res = await fetch(`/api/shipments/id/${id}`, {
//         method: "PUT",
//         body: JSON.stringify({ received: true }),
//       });
//       if (!res.ok) {
//         alert(`the marking of shipment with id ${id} has failed`);
//         throw new Error("marking of shipment has failed");
//       }
//       const resJson = await res.json();
//       console.log(resJson.data);
//       const ship = shipments.find((shipment) => shipment.id === id);
//       ship!.received = true;
//       setState((state) => !state);
//     } catch (e: Error | any) {
//       console.error(e);
//     }
//   };
//   const sendAutomatedBroadcast = async () => {
//     try {
//       const subject = "automated broadcast subject";
//       const message = "automated broadcast message";
//       const broadcastRes = await sendBroadcast(
//         email,
//         [volunteer.email],
//         subject,
//         message
//       );
//       if (!broadcastRes.success) {
//         alert(broadcastRes.error.message);
//         return;
//       }
//       alert(`Broadcast sent successfully to ${volunteer.email}`);
//     } catch (e: Error | any) {
//       console.error(e);
//     }
//   };

//   const decideReactivationReq = async (accepted: boolean) => {
//     try {
//       if (!reactivationReq) {
//         throw new Error(
//           "Hmmm something went wrong- attempting to reject a reactivatino request that apparently doesn't exist"
//         );
//       }
//       removeReactivationReq(drive.driveCode);
//       const res = await deleteReactivationRequest(
//         driveCode,
//         reactivationReq.id
//       );
//       if (accepted)
//         await updateBookDriveStatus(driveCode, BookDriveStatus.Active);
//       if (!res.success)
//         throw new Error(
//           `something went wrong: The reactivation request might have been deleted on the volunteer side. Please try refreshing the page`
//         );
//       alert(
//         `successfully ${
//           accepted ? "accepted" : "rejected"
//         } the reactivation request for ${drive.driveName}`
//       );
//     } catch (e: Error | any) {
//       console.error(e);
//       if ("message" in e) alert(e.message as any);
//     }
//   };

  // const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      minWidth={"300px"}
      paddingTop={"30%"}
    >
      <Grid item>
        <Typography
          variant="h5"
          sx={{
            color: "#FE9834",
            fontWeight: 600,
            fontSize: 30,
            fontFamily: "Epilogue",
          }}
        >
          {adminProfile.adminName}
        </Typography>
      </Grid>
      <Grid display="flex" alignItems={"center"} marginLeft={"2%"} marginTop={2} marginBottom={1}>
        <div style={{backgroundColor: "#F3D39A", borderRadius:"50%", width:35, height:35, display:"flex", justifyContent:"center",alignItems:"center"}}>
            <div style={{paddingTop:1}}><EmailOutlined sx={{color:"#5F5F5F"}}/></div>
        </div>
            
            <p style={{marginLeft:"2%"}}>{adminProfile.email}</p>
      </Grid>
      <Grid display="flex" alignItems={"center"} marginLeft={"2%"}  marginBottom={1}>
        <div style={{backgroundColor: "#F3D39A", borderRadius:"50%", width:35, height:35, display:"flex", justifyContent:"center",alignItems:"center"}}>
            <div style={{paddingTop:1}} ><BadgeIcon sx={{color:"#5F5F5F"}}/></div>
        </div>
            
            <p style={{marginLeft:"2%"}}>Role: Container Manager, Super Admin</p>
      </Grid>
      <Grid display="flex" alignItems={"center"} marginLeft={"2%"}  marginBottom={1}>
        <div style={{backgroundColor: "#F3D39A", borderRadius:"50%", width:35, height:35, display:"flex", justifyContent:"center",alignItems:"center"}}>
            <div style={{paddingTop:1}} ><FavoriteBorderIcon sx={{color:"#5F5F5F"}}/></div>
        </div>
            
            <p style={{marginLeft:"2%"}}>Affiliation: {adminProfile.affiliation}</p>
      </Grid>
      <Grid display="flex" alignItems={"center"} marginLeft={"2%"}  marginBottom={2}>
      <div style={{backgroundColor: "#F3D39A", borderRadius:"50%", width:35, height:35, display:"flex", justifyContent:"center",alignItems:"center"}}>
            <div style={{paddingTop:1}}><PlaceIcon sx={{color:"#5F5F5F"}}/></div>
        </div>
            <p style={{marginLeft:"2%"}}>{adminProfile.state}</p>
      </Grid>
      <Grid marginLeft={"2%"}>
        <Button sx={{ width:"70%",padding: 2, cursor: "pointer", height:"35px",fontFamily:"Epilogue",
                    fontWeight:"bold",color:"#5F5F5F",textTransform: 'none',outline:"none",backgroundColor:"#F3D39A",fontSize:"100%", justifyContent:"left"
                  }}>
            <p>Remove Admin Status</p>
        </Button>
      </Grid>
      {/*<Grid marginLeft={"2%"} marginTop={3}>
        <Typography
            variant="h5"
            sx={{
                color: "#FE9834",
                fontWeight: 600,
                fontSize: 25,
                fontFamily: "Epilogue",
            }}
            >
            Current Drives
            </Typography>
      </Grid>
      <Grid marginLeft={"3%"} marginTop={1}>
        {adminProfile.driveIds.map((driveId) => {
            return (
                <p>{driveId} | Drive State</p>
            )
        })}
      </Grid> */}
      </Grid>
  );
};

export default AdminDirectorySidebar;
