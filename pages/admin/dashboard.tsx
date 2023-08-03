import { getSession } from 'next-auth/react'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import getShipmentModel, { Shipment } from '../../models/Shipment';
import mongoose from 'mongoose';
import { DataGrid, GridColDef, GridCellParams, GridRowParams } from '@mui/x-data-grid'
import { BookDriveStatus, deadlineMap } from '../../lib/enums';
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box'
import useClickOutside from '../../lib/useClickOutside';
import type { } from '@mui/x-data-grid/themeAugmentation';
import styles from './adminTable.module.css'
import AdminSidebar from '../../components/AdminSidebar';


type AdminDashboardProps = {
    account: AdminAccount;
    volunteers: VolunteerAccount[];
    // drives: BookDrive[];
    error: Error | null;
    driveData: { drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount }[] | null
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({ account, volunteers, error, driveData }) => {
    const drives = driveData?.map(driveDatum => driveDatum.drive)
    console.log(account)
    console.log(volunteers)
    console.log(drives)

    const [showSidebar, setShowSidebar] = useState(false)
    const [sidebarDriveDatum, setSideBarDriveData] = useState<{ drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount } | undefined>(driveData && driveData.length != 0 ? driveData[0] : undefined)
    const [, setState] = useState(false)
    
    const updateBookDriveStatus = async (driveCode: string, status: number): Promise<void> => {
        try {
            const res = await fetch(`/api/bookDrive/${driveCode}`, {
                method: "PUT",
                body: JSON.stringify({ status: status })
            })
            if (!res.ok) {
                alert("updating the status failed")
                throw new Error("updating the status failed")
            }
            const resJson = await res.json()
            console.log(resJson.data)
            const modifiedDrive = driveData?.find(driveDatum => driveDatum.drive.driveCode === resJson.data.driveCode)
            if (!modifiedDrive) throw new Error("something went wrong - Internal Server Error")
            console.log(modifiedDrive)
            modifiedDrive!.drive.status = status
            setState(prev => !prev)
            alert("drive marked as active successfully")
        } catch (e: Error | any) {
            console.error(e)
        }
    }
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
            const sideDrive = driveData?.find(driveDatum => driveDatum.drive.driveName === driveName)
            console.log(sideDrive)
            setSideBarDriveData(sideDrive) // I hope this doesn't get too slowly
            setShowSidebar(true)
        }
    }
    const sidebarRef = useRef<HTMLDivElement>(null);

    useClickOutside(sidebarRef, () => {
        setShowSidebar(false);
    });

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
                    {volunteers && volunteers.map(volunteer => <p key={volunteer.email}>{volunteer.email}</p>)}
                    {drives && drives.map(drive => <p key={drive.driveCode}>{drive.driveName}</p>)}
                </div>}
            {account && gridRows && gridColumns && driveData &&
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
            {sidebarDriveDatum && <div ref={sidebarRef} style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                overflowY: 'scroll',
                background: '#F5F5F5',
                padding: '15px',
                boxSizing: 'border-box',
                transformOrigin: 'top right',
                transform: 'scale(1)',
                transition: 'width .4s ease',
                width: showSidebar ? 'calc(35% + 20px)' : 0
            }}><AdminSidebar updateBookDriveStatus={updateBookDriveStatus} volunteer={sidebarDriveDatum.volunteer} drive={sidebarDriveDatum.drive} shipments={sidebarDriveDatum.shipments} />
            </div>}
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

        const driveDataPromises: Promise<{ drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount }>[] = account.driveIds.map(async (driveId) => {
            const drive = await BookDrive.findOne({ driveCode: driveId }) as BookDrive
            if (!drive) throw new Error(`no bookdrive found with code ${driveId}`)
            const shipmentPromises = drive.fl.shipments.map(async (shipmentId) => await ShipmentModel.findById(shipmentId))
            const shipments = await Promise.all(shipmentPromises) as Shipment[]
            const volunteer = await VolunteerAccount.findOne({ fname: drive.organizer.split(" ")[0], lname: drive.organizer.split(" ")[1] }) as VolunteerAccount
            if (!volunteer) throw new Error(`no volunteer found with name ${drive.organizer}`)
            return { drive: drive, shipments: shipments, volunteer: volunteer }
        })
        const driveData = await Promise.all(driveDataPromises)
        console.log(driveData)
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), driveData: JSON.parse(JSON.stringify(driveData)) } }
    } catch (e: Error | any) {
        console.log(e)
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, drives: null, volunteers: null } }
    }
}