import { BookDrive } from "../models/BookDrive"
import { Shipment } from "../models/Shipment"
import { VolunteerAccount } from "../models/VolunteerAccount"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from "@mui/material/Typography"
import CircularIcon from "./CircularIcon"
import { BookDriveStatus } from "../lib/enums"
import { statusMap } from "../lib/enums"
import { deadlineMap } from "../lib/enums"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import Link from 'next/link'
import { useState } from "react"
import UpCaret from "./UpCaret"
import DownCaret from "./DownCaret"
import { getStates } from "../lib/enums"

const AdminSidebar: React.FC<{ drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount }> = ({ drive, shipments, volunteer }) => {
    const { status, organizer, driveName, driveCode, country, completedDate, startDate, mailDate, fl, pts, booksGoal, gs, cb } = drive
    const [showReactivationReq, setShowReactivationReq] = useState(false)
    const [showUpdateHistory, setShowUpdateHistory] = useState(false)
    const [, setState] = useState(false)
    const states = getStates()
    const markShipmentReception = async (id: number) => {
        try {
            const res = await fetch(`/api/shipments/id/${id}`, {
                method: "PUT",
                body: JSON.stringify({received: true})
            })
            if (!res.ok) {
                alert(`the marking of shipment with id ${id} has failed`)
                throw new Error("marking of shipment has failed")
            }
            const resJson = await res.json()
            console.log(resJson.data)
            const ship = shipments.find(shipment => shipment.id === id)
            ship!.received = true;
            setState(state => !state);
        } catch (e: Error | any) {
            console.error(e)
        }
    }
    const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    return (
        
            <Grid container direction="column" alignItems="center" spacing={1} minWidth={"300px"}>
                <Grid item>
                    <Typography variant="h5" sx={{ color: "#FE9834", fontWeight: 600, fontSize: 30, fontFamily: "Epilogue" }}>{driveName}</Typography>
                </Grid>
                <Grid item container direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                    <Grid item container direction="column" spacing={1} xs={6} sx={{ justifyContent: "center", alignItems: "flex-start", paddingLeft: 6 }}>
                        <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                            <CircularIcon stringContent={status === BookDriveStatus.Cancelled ? '!' : null} reactNodeContent={status === BookDriveStatus.Active ? <path fillRule="evenodd" clipRule="evenodd" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM13.5369 4.94545C12.684 4.95304 11.9296 5.50036 11.6576 6.30883L9.99288 11.2583C9.87756 11.6012 9.86033 11.9534 9.92607 12.2845L9.87851 12.2917C9.77972 12.3067 9.68458 12.3308 9.59382 12.3632L8.8284 14.6388C9.14584 15.1239 9.72682 15.4062 10.3374 15.3135L13.7239 14.7992L11.4181 23.7664C11.3616 23.9862 11.494 24.2102 11.7138 24.2667C11.8934 24.3129 12.0816 24.2331 12.1733 24.0719L19.209 11.7043C19.2325 11.663 19.2504 11.6188 19.2622 11.5728C19.3359 11.2862 19.1633 10.9941 18.8767 10.9204L18.857 10.9154L14.6362 11.5682L14.6355 11.5693L13.8078 11.695C13.8048 11.673 13.8071 11.65 13.8155 11.6279L16.2086 5.33505C16.2769 5.13211 16.1248 4.9224 15.9107 4.92431L13.5369 4.94545Z" fill="#F3D39A" />
                                : null} bgColor={status === BookDriveStatus.Active ? '#5F5F5F' : '#F3D39A'} fgColor={'#5F5F5F'} />
                            <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{statusMap.get(status)}</Typography>
                        </Grid>
                        <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                            <CircularIcon stringContent='#' fgColor='#5F5F5F' bgColor='#F3D39A' />
                            <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{booksGoal === 500 ? "Half library" : "Full library"}</Typography>

                        </Grid>
                        <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                            <CircularIcon reactNodeContent={<path fillRule="evenodd" clipRule="evenodd" d="M7 17.5C7 17.5 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 7 17.5 7 17.5ZM7 9.5C8.65685 9.5 10 8.15685 10 6.5C10 4.84315 8.65685 3.5 7 3.5C5.34315 3.5 4 4.84315 4 6.5C4 8.15685 5.34315 9.5 7 9.5Z" fill="#5F5F5F" transform="translate(7 5)" />
                            } bgColor={"#F3D39A"} />
                            <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{country}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" xs={6} spacing={1} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                            <CircularIcon reactNodeContent={<><rect x="7" y="10" width="14" height="9" stroke="#5F5F5F" strokeWidth="2" />
                                <path d="M12.80216 15.82011C13.19047 16.19844 13.80953 16.19844 14.19784 15.82011L18.6666 11.46626C19.3093 10.84016 18.866 9.75 17.9688 9.75H9.0312C8.134 9.75 7.69074 10.84016 8.33337 11.46626L12.80216 15.82011Z" stroke="#5F5F5F" strokeWidth="2" /></>} bgColor={"#F3D39A"} />
                            <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{organizer}</Typography>
                        </Grid>
                        <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                            <CircularIcon bgColor={"F3D39A"} reactNodeContent={<><circle cx="14" cy="14" r="14" fill="#F3D39A" />
                                <circle cx="14" cy="14" r="9" stroke="#5F5F5F" strokeWidth="2" />
                                <circle cx="14" cy="14" r="1" fill="#5F5F5F" />
                                <rect x="12.6479" y="6.60059" width="2" height="7.46818" rx="1" transform="rotate(-3.48103 12.6479 6.60059)" fill="#5F5F5F" />
                                <rect x="17.9458" y="12" width="2.00318" height="4.03109" rx="1.00159" transform="rotate(78.1979 17.9458 12)" fill="#5F5F5F" /></>} />
                            <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{deadlineMap.get(country)!.toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container justifyContent="space-between" direction="row" width="100%" height="wrap-content">
                    <Button variant="contained" sx={{
                        marginBottom: 1, backgroundColor: "#F3D39A", "&:hover": {
                            backgroundColor: "#D3A874", // Change this to a slightly darker shade of the background color.
                        }, fontSize: 11, fontWeight: 600, color: '#5F5F5F', width: "49.5%"
                    }}>Send automatic reminder</Button>
                    <Link href="/admin/broadcast"><Button variant="contained" sx={{
                        marginBottom: 1, backgroundColor: "#F3D39A", "&:hover": {
                            backgroundColor: "#D3A874", // Change this to a slightly darker shade of the background color.
                        }, fontWeight: 600, color: '#5F5F5F', fontSize: 10.8, width: "50%"
                    }}>Compose custom message</Button></Link>
                </Grid>
                {status == BookDriveStatus.Cancelled && <><Grid item width={"100%"} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <CircularIcon stringContent={"!"} fgColor={"#FE9834"} bgColor={"#F3D39A"} />
                    <Typography variant="h5" style={{ color: "#FE9834", fontWeight: 700, marginLeft: 10 }}>Reactivation Request</Typography>
                    {!showReactivationReq && <UpCaret onClick={() => setShowReactivationReq(prev => !prev)} />}
                    {showReactivationReq && <DownCaret onClick={() => setShowReactivationReq(prev => !prev)} />}
                </Grid>
                    <div
                        style={{
                            overflow: "hidden",
                            transition: "height .3s ease", // You can adjust the timing and easing here
                            height: showReactivationReq ? "260px" : 0,
                        }}
                    >
                        <Grid item>
                            <TextareaAutosize maxRows={15} minRows={15} cols={50} style={{ overflowY: "auto", resize: "none", border: "1.5px solid black", borderRadius: "3%" }} readOnly placeholder={loremIpsum} />
                        </Grid>
                        <Grid item display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                            <Button variant="contained" sx={{ color: "#5F5F5F", fontWeight: 600, fontSize: 12, backgroundColor: "#F3D39A", "&:hover": { backgroundColor: "#D3A874" }, marginRight: 1 }}>Reply</Button>
                            <Button variant="contained" sx={{ color: "#5F5F5F", fontWeight: 600, fontSize: 12, backgroundColor: "#F3D39A", "&:hover": { backgroundColor: "#D3A874" }, marginRight: 1 }}>Accept</Button>
                            <Button variant="contained" sx={{ color: "#5F5F5F", fontWeight: 600, fontSize: 12, backgroundColor: "#F3D39A", "&:hover": { backgroundColor: "#D3A874" } }}>Reject</Button>
                        </Grid></div></>}
                <Grid container spacing={1} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingX: 1 }}>
                    <Grid item sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>

                        <Typography variant="h5" sx={{ marginRight: 1, color: "#FE9834", fontWeight: 600 }}>Update History</Typography>
                        {!showUpdateHistory && <UpCaret onClick={() => setShowUpdateHistory(prev => !prev)} key="no" />}
                        {showUpdateHistory && <DownCaret onClick={() => setShowUpdateHistory(prev => !prev)} key="hi" />}
                    </Grid>
                    <div style={{
                        overflow: "auto",
                        transition: "height .3s ease",
                        height: showUpdateHistory? "400px": 0
                    }}>
                        <Grid sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", paddingX: 1 }}>
                            <Typography variant={"h6"} sx={{ fontWeight: 600, color: "#5F5F5F" }}>Shipment Progress</Typography>
                            {shipments && shipments.map((shipment) => {
                                return (
                                    <Grid key={shipment.id} display={"flex"} justifyContent={"flex-start"} alignItems="flex-start">
                                        <Typography sx={{ marginRight: 1, color: "#5F5F5F" }}>{new Date(shipment.date).toLocaleDateString()}</Typography>
                                        <Typography sx={{ marginRight: 1, color: "#5F5F5F" }}>{`${shipment.numBooks} book${shipment.numBooks != 1 ? 's' : ''} ${shipment.received ? "received" : `shipped from ${states[volunteer.location - 1].name}`}`}</Typography>
                                        {!shipment.received && <Button variant="contained" onClick={() => markShipmentReception(shipment.id)} sx={{
                                            backgroundColor: "#F3D39A", "&:hover": {
                                                backgroundColor: "#D3A874", // Change this to a slightly darker shade of the background color.
                                            }, fontSize: 9, fontWeight: 600, color: '#5F5F5F'
                                        }}>Received?</Button>}
                                    </Grid>
                                )
                            })}
                            <Typography variant={"h6"} sx={{ fontWeight: 600, color: "#5F5F5F" }}>Collection Progress</Typography>
                            <Grid display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                <Typography sx={{ marginRight: 1, color: "#5F5F5F" }}>{new Date(cb.lastUpdate).toLocaleDateString()}</Typography>
                                <Typography sx={{ color: "#5F5F5F" }}>{`${cb.booksCurrent} book${cb.booksCurrent != 1 ? 's' : ''} collected`}</Typography>
                            </Grid>

                        </Grid>
                    </div>
                </Grid>

            </Grid >
    )
}

export default AdminSidebar