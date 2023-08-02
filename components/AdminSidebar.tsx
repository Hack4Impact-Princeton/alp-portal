import { BookDrive } from "../models/BookDrive"
import { Shipment } from "../models/Shipment"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from "@mui/material/Typography"
import CircularIcon from "./CircularIcon"
import { BookDriveStatus } from "../lib/enums"
import { statusMap } from "../lib/enums"
import { deadlineMap } from "../lib/enums"
import TextareaAutosize from "@mui/material/TextareaAutosize"
const AdminSidebar: React.FC<{drive: BookDrive, shipments: Shipment[]}> = ({drive, shipments}) => {
    const {status, organizer, driveName, driveCode, country, completedDate, startDate, mailDate, fl, pts, booksGoal, gs, cb} = drive
    return (
        <Grid container direction="column" alignItems="center" spacing={1} sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '35%',
            minWidth: 300,
            height: '100%',
            background: '#F5F5F5',
            padding: '10px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            transformOrigin: 'top right',
            transform: 'scale(1)',
            transition: 'transform 0.2s ease-in-out',
            '&.typing': {
                transform: 'scale(0.8)',
            },
        }}>
            <Grid item>
                <Typography variant="h5" sx={{ color: "#FE9834", fontWeight: 600, fontSize: 30, fontFamily: "Epilogue" }}>{driveName}</Typography>
            </Grid>
            <Grid item container direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                <Grid item container direction="column" spacing={1} xs={6} sx={{ justifyContent: "center", alignItems: "flex-start", paddingLeft: 6 }}>
                    <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <CircularIcon stringContent={status === BookDriveStatus.Cancelled ? '!' : null} reactNodeContent={status === BookDriveStatus.Active ? <path fill-rule="evenodd" clip-rule="evenodd" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM13.5369 4.94545C12.684 4.95304 11.9296 5.50036 11.6576 6.30883L9.99288 11.2583C9.87756 11.6012 9.86033 11.9534 9.92607 12.2845L9.87851 12.2917C9.77972 12.3067 9.68458 12.3308 9.59382 12.3632L8.8284 14.6388C9.14584 15.1239 9.72682 15.4062 10.3374 15.3135L13.7239 14.7992L11.4181 23.7664C11.3616 23.9862 11.494 24.2102 11.7138 24.2667C11.8934 24.3129 12.0816 24.2331 12.1733 24.0719L19.209 11.7043C19.2325 11.663 19.2504 11.6188 19.2622 11.5728C19.3359 11.2862 19.1633 10.9941 18.8767 10.9204L18.857 10.9154L14.6362 11.5682L14.6355 11.5693L13.8078 11.695C13.8048 11.673 13.8071 11.65 13.8155 11.6279L16.2086 5.33505C16.2769 5.13211 16.1248 4.9224 15.9107 4.92431L13.5369 4.94545Z" fill="#F3D39A" />
                            : null} bgColor={status === BookDriveStatus.Active ? '#5F5F5F' : '#F3D39A'} fgColor={'#5F5F5F'} />
                        <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{statusMap.get(status)}</Typography>
                    </Grid>
                    <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <CircularIcon stringContent='#' fgColor='#5F5F5F' bgColor='#F3D39A' />
                        <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{booksGoal === 500 ? "Half library" : "Full library"}</Typography>

                    </Grid>
                    <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <CircularIcon reactNodeContent={<path fill-rule="evenodd" clip-rule="evenodd" d="M7 17.5C7 17.5 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 7 17.5 7 17.5ZM7 9.5C8.65685 9.5 10 8.15685 10 6.5C10 4.84315 8.65685 3.5 7 3.5C5.34315 3.5 4 4.84315 4 6.5C4 8.15685 5.34315 9.5 7 9.5Z" fill="#5F5F5F" transform="translate(7 5)" />
                        } bgColor={"#F3D39A"} />
                        <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{country}</Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="column" xs={6} spacing={1} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <CircularIcon reactNodeContent={<><rect x="7" y="10" width="14" height="9" stroke="#5F5F5F" stroke-width="2" />
                            <path d="M12.80216 15.82011C13.19047 16.19844 13.80953 16.19844 14.19784 15.82011L18.6666 11.46626C19.3093 10.84016 18.866 9.75 17.9688 9.75H9.0312C8.134 9.75 7.69074 10.84016 8.33337 11.46626L12.80216 15.82011Z" stroke="#5F5F5F" stroke-width="2" /></>} bgColor={"#F3D39A"} />
                        <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{organizer}</Typography>
                    </Grid>
                    <Grid item display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <CircularIcon bgColor={"F3D39A"} reactNodeContent={<><circle cx="14" cy="14" r="14" fill="#F3D39A" />
                            <circle cx="14" cy="14" r="9" stroke="#5F5F5F" stroke-width="2" />
                            <circle cx="14" cy="14" r="1" fill="#5F5F5F" />
                            <rect x="12.6479" y="6.60059" width="2" height="7.46818" rx="1" transform="rotate(-3.48103 12.6479 6.60059)" fill="#5F5F5F" />
                            <rect x="17.9458" y="12" width="2.00318" height="4.03109" rx="1.00159" transform="rotate(78.1979 17.9458 12)" fill="#5F5F5F" /></>} />
                        <Typography variant="body1" sx={{ marginLeft: 1, color: "#5F5F5F" }}>{deadlineMap.get(country)!.toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container justifyContent="center" direction="column">
                <Button variant="contained" sx={{marginBottom: 1, backgroundColor: "#F3D39A", fontSize: 13, fontWeight: 600, color: '#5F5F5F', width: "56%" }}>Send automatic reminder</Button>
                <Button variant="contained" sx={{marginBottom: 1, backgroundColor: "#F3D39A", fontWeight: 600, color: '#5F5F5F', fontSize: 13, width: "56%" }}>Compose custom message</Button>
                {status == BookDriveStatus.Cancelled &&
                    <Button variant="contained" sx={{marginBottom: 1, backgroundColor: "#F3D39A", fontSize: 13, fontWeight: 600, color: '#5F5F5F', width: "56%" }}>Reactivate Drive</Button>
                }
            </Grid>
            {status == BookDriveStatus.Cancelled && <Grid item width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <CircularIcon stringContent={"!"} fgColor={"#FE9834"} bgColor={"#F3D39A"} />
                <Typography variant="h5" style={{ color: "#FE9834", fontWeight: 700, marginLeft: 10 }}>Reactivation Request</Typography>
            </Grid>}
            <Grid item>
                <TextareaAutosize minRows={3} cols={50} placeholder="Enter text here" />
            </Grid>
            <Grid item container justifyContent="center" spacing={1}>
                <Grid item>
                    <Button variant="contained">Button 4</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained">Button 5</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained">Button 6</Button>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h5">Heading 3</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h5">Subheading</Typography>
                <Typography variant="body1">Some content here</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h5">Another Subheading</Typography>
                <Typography variant="body1">More content here</Typography>
            </Grid>
        </Grid>
    )
}

export default AdminSidebar