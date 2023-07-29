import { getSession } from 'next-auth/react'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import mongoose from 'mongoose';
import { DataGrid, GridColDef, GridCellParams, GridRowParams } from '@mui/x-data-grid'
import { BookDriveStatus } from '../../lib/enums';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box'
import { deadlineMap, statusMap } from '../../lib/enums';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button'
// When using TypeScript 4.x and above
import type { } from '@mui/x-data-grid/themeAugmentation';
import { columnMenuStateInitializer } from '@mui/x-data-grid/internals';
import styles from './adminTable.module.css'
// const theme = createTheme({
//   components: {
//     // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
//     MuiDataGrid: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'red',
//         },
//       },
//     },
//   },
// });

type AdminDashboardProps = {
    account: AdminAccount;
    volunteers: VolunteerAccount[];
    drives: BookDrive[];
    error: Error | null;
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({ account, volunteers, drives, error }) => {
    console.log(account)
    console.log(volunteers)
    console.log(drives)

    const [showSidebar, setShowsidebar] = useState(false)
    const [sidebarDrive, setSidebarDrive] = useState<BookDrive | undefined>(drives.length != 0 ? drives[0] : undefined)

    const prelimColumns: GridColDef[] = [
        { field: 'driveName', headerName: 'Drive Name', width: 250 },
        { field: 'size', headerName: "Size", width: 40 },
        { field: "country", headerName: "Country", width: 250 },
        { field: 'organizer', headerName: "Organizer", width: 150 },
        { field: "lastUpdated", headerName: "Last Updated", width: 200 }
    ]
    const gridColumns: GridColDef[] = prelimColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => (
                // textDecoration: "underline"
                <span style={{ fontWeight: column.field === 'driveName' ? 600 : 400, cursor: column.field === 'driveName' ? "pointer" : "default", whiteSpace: "normal" }}>{params.value as string}</span>
            ),
        }
    })
    const isDeadlineApproaching = (country: string): boolean => {
        // TODO implement deadline logic here based on date and current time
        if (!deadlineMap.has(country)) throw new Error(`${country} does not exist in deadline map`)
        return deadlineMap.get(country)!.getTime() - new Date().getTime() < (31 * 24 * 60 * 60 * 1000)
    }
    // ❗🕔 
    const gridRows = drives.filter(drive => drive.status === BookDriveStatus.Active || BookDriveStatus.Cancelled).map(drive => {
        let driveName = drive.driveName
        if (drive.status == BookDriveStatus.Cancelled) driveName = `❗ ${driveName}`
        if (isDeadlineApproaching(drive.country)) driveName = `🕔 ${driveName}`
        return { id: drive.driveCode, driveName: driveName, size: drive.booksGoal, country: drive.country, organizer: drive.organizer, lastUpdated: new Date(drive.cb.lastUpdate).toLocaleDateString(), status: drive.status }
    })

    const handleDriveNameClick = (params: GridCellParams) => {
        if (params.field === 'driveName') {
            const unsanitizedString = params.value as string
            console.log(unsanitizedString)
            const specialChars = /^(\p{So}+)/gu
            const midDriveName = unsanitizedString.replace(specialChars, '')
            console.log(midDriveName)
            const driveName = midDriveName.trim()
            console.log(driveName)
            setShowsidebar(true)
            const sideDrive = drives.find(drive => drive.driveName === driveName)
            console.log(sideDrive)
            setSidebarDrive(sideDrive) // I hope this doesn't get too slowly
        }
    }
    useEffect(() => {
        console.log(showSidebar)
        console.log(sidebarDrive)
    }, [showSidebar])

    useEffect(() => {
        console.log(sidebarDrive)
    }, [sidebarDrive])
    console.log(gridRows.length)

    const setRowClassName = (params: GridRowParams) => {
        if (params.row.status === BookDriveStatus.Cancelled) return styles['cancelled-row'];
        else if (params.row.id === 'header') return styles['header-row']; // this never works I don't know where to set the header row
        else return '';
    };
    return (
        <>
            {account &&
                <div>
                    {account && <p>{account.fname} {account.lname}</p>}
                    {volunteers && volunteers.map(volunteer => <p>{volunteer.email}</p>)}
                    {drives && drives.map(drive => <p>{drive.driveName}</p>)}
                </div>}
            <Box sx={{ height: "wrap-content", width: '80%' }}>
                <DataGrid
                    rows={gridRows}
                    columns={gridColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onCellClick={handleDriveNameClick}
                    getRowClassName={setRowClassName}
                />
            </Box>
            {showSidebar && sidebarDrive &&
                <Grid container direction="column" alignItems="center" spacing={2} sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '35%',
                    minWidth: 300,
                    height: '100%',
                    background: 'lightgray',
                    padding: '20px',
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
                        <Typography variant="h4" sx={{ color: "orange" }}>{sidebarDrive.driveName}</Typography>
                    </Grid>
                    <Grid item container direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                        <Grid item container direction="column" xs={6} sx={{ justifyContent: "center" }}>
                            <ul>
                                <li>
                                    <Typography variant="body1">{statusMap.get(sidebarDrive.status)}</Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">{sidebarDrive.booksGoal === 500 ? "Half library" : "Full library"}</Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">{sidebarDrive.country}</Typography>
                                </li>
                            </ul>
                        </Grid>
                        <Grid item container direction="column" xs={6} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <ul>
                                <li>
                                    <Typography variant="body1">{sidebarDrive.organizer}</Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">{deadlineMap.get(sidebarDrive.country)!.toLocaleDateString()}</Typography>
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent="center" direction="row" spacing={1}>
                        <Grid item>
                            <Button variant="contained" sx={{backgroundColor: "orange", fontSize: 10, width: "fit-content"}}>Send automatic reminder</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" sx={{backgroundColor: "orange", fontSize: 10}}>Compose custom message</Button>
                        </Grid>
                        {sidebarDrive.status == BookDriveStatus.Cancelled && <Grid item>
                            <Button variant="contained" sx={{backgroundColor: "orange"}}>Reactivate Drive</Button>
                        </Grid>}
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Heading 2</Typography>
                    </Grid>
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
            }
        </>)
}

export default AdminDashboard

export const getServerSideProps = async (context: any) => {
    try {
        const session = await getSession(context)
        if (!session || session.user?.name != 'true') {
            return {
                redirect: {
                    destination: '../auth/login',
                    permanent: false
                }
            }
        }
        const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
        const account: AdminAccount = await AdminAccount.findOne({ email: session.user.email }) as AdminAccount
        console.log("account", account)
        const volunteerList = account.volunteerIds
        const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
        const vPromises = volunteerList.map(volunteerId => VolunteerAccount.findOne({ alp_id: volunteerId }))
        const volunteers = await Promise.all(vPromises) as VolunteerAccount[]
        console.log("volunteers", volunteers)
        const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel()
        const driveList = account.driveIds
        const bPromises = driveList.map(driveId => BookDrive.findOne({ driveCode: driveId }))
        const drives = await Promise.all(bPromises) as BookDrive[]
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), drives: JSON.parse(JSON.stringify(drives)) } }
    } catch (e: Error | any) {
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, drives: null, volunteers: null } }
    }
}