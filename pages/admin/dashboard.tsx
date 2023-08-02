import { getSession } from 'next-auth/react'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import getShipmentModel, { Shipment } from '../../models/Shipment';
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
import CircularExclamationIcon from '../../components/CircularIconBad';
import CircularIcon from '../../components/CircularIcon';
import AdminSidebar from '../../components/AdminSidebar';
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
    // drives: BookDrive[];
    error: Error | null;
    driveData: { drive: BookDrive, shipments: Shipment[] }[] | null
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({ account, volunteers, error, driveData }) => {
    const drives = driveData?.map(driveDatum => driveDatum.drive)
    console.log(account)
    console.log(volunteers)
    console.log(drives)

    const [showSidebar, setShowsidebar] = useState(false)
    const [sidebarDriveDatum, setSideBarDriveData] = useState<{ drive: BookDrive, shipments: Shipment[] } | undefined>(driveData && driveData.length != 0 ? driveData[0] : undefined)

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
    const gridRows = drives?.filter(drive => drive.status === BookDriveStatus.Active || BookDriveStatus.Cancelled).map(drive => {
        let driveName = drive.driveName
        if (drive.status == BookDriveStatus.Cancelled) driveName = `❗ ${driveName}`
        if (isDeadlineApproaching(drive.country)) driveName = `🕔 ${driveName}`
        return { id: drive.driveCode, driveName: driveName, size: drive.booksGoal, country: drive.country, organizer: drive.organizer, lastUpdated: new Date(drive.cb.lastUpdate).toLocaleDateString(), status: drive.status }
    })

    const handleDriveNameClick = (params: GridCellParams) => {
        if (params.field === 'driveName') {
            const preDriveName = params.value as string
            const midDriveName = preDriveName.replace(/[^a-zA-Z0-9\s\p{P}]/gu, '')
            console.log(midDriveName)
            const driveName = midDriveName.trim()
            setShowsidebar(true)
            const sideDrive = driveData?.find(driveDatum => driveDatum.drive.driveName === driveName)
            console.log(sideDrive)
            setSideBarDriveData(sideDrive) // I hope this doesn't get too slowly
        }
    }
    // useEffect(() => {
    //     console.log(showSidebar)
    //     console.log(sidebarDriveDatum)
    // }, [showSidebar])

    // useEffect(() => {
    //     console.log(sidebarDriveDatum)
    // }, [sidebarDriveDatum])
    // console.log(gridRows?.length)

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
            {account && gridRows && gridColumns &&
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
                </Box>}
            {showSidebar && sidebarDriveDatum && <AdminSidebar drive={sidebarDriveDatum.drive} shipments={sidebarDriveDatum.shipments}/>}
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
        // const driveList = account.driveIds
        // const bPromises = driveList.map(driveId => BookDrive.findOne({ driveCode: driveId }))
        // const drives = await Promise.all(bPromises) as BookDrive[]
        const ShipmentModel: mongoose.Model<Shipment> = getShipmentModel()

        const driveDataPromises: Promise<{ drive: BookDrive, shipments: Shipment[] }>[] = account.driveIds.map(async (driveId) => {
            const drive = await BookDrive.findOne({ driveCode: driveId }) as BookDrive
            if (!drive) throw new Error(`no bookdrive found with code ${driveId}`)
            const shipmentPromises = drive.fl.shipments.map(async (shipmentId) => await ShipmentModel.findById(shipmentId))
            const shipments = await Promise.all(shipmentPromises) as Shipment[]
            return { drive: drive, shipments: shipments }
        })
        const driveData = await Promise.all(driveDataPromises)
        console.log(driveData)
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), driveData: JSON.parse(JSON.stringify(driveData)) } }
    } catch (e: Error | any) {
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, drives: null, volunteers: null } }
    }
}