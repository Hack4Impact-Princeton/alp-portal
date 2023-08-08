import { getServerSession } from 'next-auth/next'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import getShipmentModel, { Shipment } from '../../models/Shipment';
import mongoose from 'mongoose';
import { Box } from '@mui/material';
import { authOptions } from '../api/auth/[...nextauth]';
import { DataGrid, GridColDef, GridCellParams, GridRowParams } from '@mui/x-data-grid'
import { BookDriveStatus, deadlineMap } from '../../lib/enums';
import { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import useClickOutside from '../../lib/useClickOutside';
import type { } from '@mui/x-data-grid/themeAugmentation';
import styles from './adminTable.module.css'
import AdminSidebar from '../../components/AdminSidebar';
import DownCaret from '../../components/DownCaret';
import UpCaret from '../../components/UpCaret';
import useExpandableElement from '../../lib/useExpandableElement';
import CircularIcon from '../../components/CircularIcon';
import { PanoramaVerticalSelect } from '@mui/icons-material';
import { isIdentifier } from 'typescript';

type AdminDashboardProps = {
    account: AdminAccount;
    error: Error | null;
    driveData: { drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount }[] | null
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({ account, error, driveData }) => {
    if (error) return <h1>{`error: ${error}`}</h1>
    const drives = driveData?.map(driveDatum => driveDatum.drive)
    const [showSidebar, setShowSidebar] = useState(false)
    const [sidebarDriveDatum, setSideBarDriveData] = useState<{ drive: BookDrive, shipments: Shipment[], volunteer: VolunteerAccount } | undefined>(undefined)
    const { visible: showCurrDrives, toggleVisibility: setShowCurrDrives, elementRef: currDriveTableRef, elementStyles: currDriveTableStyles } = useExpandableElement()
    const { visible: showCompletedDrives, toggleVisibility: toggleShowCompletedDrives, elementRef: completedDriveTableRef, elementStyles: completedDriveTableStyles } = useExpandableElement()
    const { visible: showQuickActions, toggleVisibility: toggleQuickActions, elementRef: quickActionsRef, elementStyles: quickActionsStyles } = useExpandableElement()
    const [, setState] = useState(false)

    const halfDrive = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25ZM12.5 23.8015C18.7416 23.8015 23.8014 18.7417 23.8014 12.5001C23.8014 6.25853 18.7416 1.19873 12.5 1.19873C6.25842 1.19873 1.19863 6.25853 1.19863 12.5001C1.19863 18.7417 6.25842 23.8015 12.5 23.8015Z" fill="#5F5F5F" />
        <path fillRule="evenodd" clipRule="evenodd" d="M4.95675e-10 12.5C4.95675e-10 12.5 0 12.5001 0 12.5001C0 19.4037 5.59644 25.0001 12.5 25.0001C19.4036 25.0001 25 19.4037 25 12.5001C25 12.5001 25 12.5 25 12.5H4.95675e-10Z" fill="#5F5F5F" />
    </svg>
    const fullDrive = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <circle cx="12.5" cy="12.5" r="12.5" fill="#5F5F5F" />
    </svg>

    const getDriveNameCell = (driveName: string) => {
        const foundDrive = drives?.find(drive => drive.driveName === driveName)
        if (foundDrive) return (
            <span style={{ textDecoration: "underline", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontWeight: 600, cursor: "pointer", whiteSpace: "normal" }}>
                {foundDrive?.status === BookDriveStatus.Cancelled ?
                    <div style={{ marginRight: 8 }}><CircularIcon stringContent="!" bgColor={"#F3D39A"} fgColor={"#5F5F5F"} /></div> : <></>}
                {isDeadlineApproaching(foundDrive.country) ?
                    <div style={{ marginRight: 8 }}><CircularIcon bgColor={"F3D39A"} reactNodeContent={<><circle cx="14" cy="14" r="14" fill="#F3D39A" />
                        <circle cx="14" cy="14" r="9" stroke="#5F5F5F" strokeWidth="2" />
                        <circle cx="14" cy="14" r="1" fill="#5F5F5F" />
                        <rect x="12.6479" y="6.60059" width="2" height="7.46818" rx="1" transform="rotate(-3.48103 12.6479 6.60059)" fill="#5F5F5F" />
                        <rect x="17.9458" y="12" width="2.00318" height="4.03109" rx="1.00159" transform="rotate(78.1979 17.9458 12)" fill="#5F5F5F" /></>} /> </div> : <></>
                }
                {driveName}
            </span>
        )
        else return <span></span>

    }

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
            // console.log(resJson.data)
            const modifiedDrive = driveData?.find(driveDatum => driveDatum.drive.driveCode === resJson.data.driveCode)
            if (!modifiedDrive) throw new Error("something went wrong - Internal Server Error")
            // console.log(modifiedDrive)
            modifiedDrive!.drive.status = status
            setState(prev => !prev)
            alert("drive marked as active successfully")
        } catch (e: Error | any) {
            console.error(e)
        }
    }
    const isDeadlineApproaching = (country: string): boolean => {
        // TODO implement deadline logic here based on date and current time
        if (!country) throw new Error("Something went wrong - country is undefined")
        if (!deadlineMap.has(country)) throw new Error(`${country} does not exist in deadline map`)
        return deadlineMap.get(country)!.getTime() - new Date().getTime() < (31 * 24 * 60 * 60 * 1000)
    }
    const prelimCurrDrivesColumns: GridColDef[] = [
        { field: 'driveName', headerName: 'Drive Name', width: 300 },
        { field: 'size', headerName: "Size", width: 40 },
        { field: "country", headerName: "Country", width: 175 },
        { field: 'organizer', headerName: "Organizer", width: 150 },
        { field: "lastUpdated", headerName: "Last Updated", width: 120 }
    ]
    const prelimCompletedDrivesColumns: GridColDef[] = [
        { field: 'driveName', headerName: 'Drive Name', width: 300 },
        { field: 'size', headerName: "Size", width: 40 },
        { field: "country", headerName: "Country", width: 175 },
        { field: 'organizer', headerName: "Organizer", width: 150 },
        { field: 'completedDate', headerName: "Completed", width: 120 }
    ]
    const prelimReactivationReqColumns: GridColDef[] = [{ field: 'driveName', headerName: 'Reactivation Requests', width: 300 }]
    const prelimShipmentsPendingColumns: GridColDef[] = [{ field: 'driveName', headerName: 'Shipments Pending', width: 300 }]
    const prelimNotUpdatedInColumns: GridColDef[] = [{ field: 'driveName', headerName: 'Not Updated in 10 Days', width: 300 }]
    const reactivationReqColumns = prelimReactivationReqColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => {
                const colDriveName = params.value as string
                return getDriveNameCell(colDriveName)
            }
        }
    })
    const shipmentsPendingColumns = prelimShipmentsPendingColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => {
                const colDriveName = params.value as string
                return getDriveNameCell(colDriveName)
            }
        }
    })
    const notUpdatedInColumns = prelimNotUpdatedInColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => {
                const colDriveName = params.value as string
                return getDriveNameCell(colDriveName)
            }
        }
    })
    const currDrivesGridColumns: GridColDef[] = prelimCurrDrivesColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => {
                if (column.field === 'driveName') {
                    if (!drives) throw new Error("drives don't exist???")
                    const colDriveName = params.value as string
                    return getDriveNameCell(colDriveName)
                }
                else if (column.field === 'size') {
                    const val = params.value as number
                    if (val == 500) return halfDrive
                    else return fullDrive
                }
                else if (column.field === 'country') return <span style={{ whiteSpace: 'normal' }}>{params.value as string}</span>

            }
        }
    })
    const completedDrivesColumns: GridColDef[] = prelimCompletedDrivesColumns.map((column) => {
        return {
            ...column,
            renderCell: (params: GridCellParams) => {
                if (column.field === 'driveName') {
                    return <span style={{ textDecoration: "underline", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontWeight: 600, cursor: "pointer", whiteSpace: "normal" }}>{params.value as string} </span>
                }
                else if (column.field === 'size') {
                    const val = params.value as number
                    if (val == 500) return halfDrive
                    else return fullDrive
                }
            }
        }
    })
    const currDrives = drives?.filter(drive => drive.status === BookDriveStatus.Active || drive.status === BookDriveStatus.Cancelled)
    // console.log(currDrives)
    // console.log("currDrive length", currDrives?.length)
    const currDrivesGridRows = currDrives?.map(drive => {
        // console.log("acceptable statuses", `${BookDriveStatus.Cancelled}, ${BookDriveStatus.Active}`)
        // console.log("status by driveName", `${drive.driveName}: ${drive.status}`)
        return { id: drive.driveCode, driveName: drive.driveName, size: drive.booksGoal, country: drive.country, organizer: drive.organizer, lastUpdated: new Date(drive.cb.lastUpdate).toLocaleDateString(), status: drive.status }
    })

    const completedDrivesGridRows = drives ? drives.filter(drive => drive.status === BookDriveStatus.Completed).map(drive => {
        // console.log("status by driveName", `${drive.driveName}: ${drive.status}`)

        return { id: drive.driveCode, driveName: drive.driveName, size: drive.booksGoal, country: drive.country, organizer: drive.organizer, completedDate: new Date(drive.completedDate).toLocaleDateString() }
    }) : []

    const shipmentsPendingRows = drives ? drives.filter(drive => drive.status === BookDriveStatus.Verifying).map(drive => {
        return { id: drive.driveCode, driveName: drive.driveName }
    }) : []

    // this is temporary - I need to figure out how we are going to know if there was a reactivation request made or not
    const reactivationReqRows = drives ? drives.filter(drive => drive.country === 'South Africa').map(drive => {
        return { id: drive.driveCode, driveName: drive.driveName }
    }) : []

    const notUpdatedInRows = drives ? drives.filter(drive => drive.status === BookDriveStatus.Active && new Date().getTime() - new Date(drive.cb.lastUpdate).getTime() > (10 * 24 * 60 * 60 * 1000)).map((drive) => {
        return {id: drive.driveCode, driveName: drive.driveName}
    }) : []
    // ❗🕔 

    const handleDriveNameClick = (params: GridCellParams) => {
        if (params.field === 'driveName') {
            const preDriveName = params.value as string
            const midDriveName = preDriveName.replace(/[^a-zA-Z0-9\s\p{P}]/gu, '')
            // console.log(midDriveName)
            const driveName = midDriveName.trim()
            if (sidebarDriveDatum && driveName === sidebarDriveDatum.drive.driveName) {
                closeSidebar()
                // console.log("closing the drive because we have a duplicate: ", driveName)
                return
            }
            // console.log("setting the new  drive to be ", driveName)
            const sideDrive = driveData?.find(driveDatum => driveDatum.drive.driveName === driveName)
            setTimeout(() => {
                setSideBarDriveData(sideDrive)
                setShowSidebar(true)
            }, 220) // I hope this doesn't get too slowly
        }
    }
    const sidebarRef = useRef<HTMLDivElement>(null);
    const closeSidebar = () => {
        setShowSidebar(false)
        setTimeout(() => {
            setSideBarDriveData(undefined);
        }, 200);
    }
    useClickOutside(sidebarRef, closeSidebar)

    const setRowClassName = (params: GridRowParams) => {
        if (params.row.status === BookDriveStatus.Cancelled) return styles['cancelled-row'];
        else if (params.row.id === 'header') return styles['header-row']; // this never works I don't know where to set the header row
        else return '';
    };


    return (
        <>
            <Grid sx={{ width: "100%", height: "100%", padding: 5 }}>
                {account &&
                    <Grid sx={{ marginBottom: 3, width: "100%" }}>
                        <Grid display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" >
                            <h1 style={{ color: "#5F5F5F", marginRight: 10, fontSize: 90, fontWeight: 600 }}>DASHBOARD</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="67" height="65" viewBox="0 0 67 65" fill="none" onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M58.2318 30.9165C58.0576 28.316 55.3593 26.8851 52.8828 27.6974C50.614 28.4416 49.3812 30.8298 49.2658 33.2147C49.0294 38.0981 46.3651 42.7562 41.7909 45.3332C34.7129 49.321 25.7424 46.8158 21.7547 39.7378C21.2681 38.8741 20.2578 38.3989 19.3158 38.7079L15.7623 39.8735C13.941 40.4709 12.9727 42.4855 13.9136 44.1555C20.3411 55.5641 34.8001 59.602 46.2086 53.1744C54.429 48.5431 58.8227 39.7418 58.2318 30.9165ZM11.0861 29.2468C10.6632 32.2674 13.7235 34.2536 16.6216 33.3029C18.5618 32.6665 19.8135 30.8478 20.3201 28.8697C21.2806 25.1194 23.711 21.7519 27.3501 19.7016C32.7856 16.6393 39.337 17.406 43.891 21.1322C45.4726 22.4263 47.5592 23.1549 49.5011 22.518C52.395 21.5687 53.687 18.1586 51.564 15.9749C44.2438 8.44537 32.5126 6.46302 22.9324 11.8605C16.2335 15.6346 12.0759 22.1779 11.0861 29.2468Z" fill="#5F5F5F" />
                                <path d="M12.2871 36.4002C12.4325 35.1886 13.6197 34.3886 14.7973 34.7086L27.5498 38.1742C29.2022 38.6232 29.563 40.8058 28.143 41.7627L13.8155 51.4179C12.3955 52.3749 10.508 51.2211 10.712 49.521L12.2871 36.4002Z" fill="#5F5F5F" />
                                <path d="M55.5213 22.6482C55.755 23.8459 54.871 24.9719 53.652 25.0291L40.4515 25.648C38.741 25.7283 37.7273 23.762 38.7847 22.4152L49.4539 8.82588C50.5114 7.47907 52.662 7.99725 52.99 9.67786L55.5213 22.6482Z" fill="#5F5F5F" />
                            </svg>
                        </Grid>
                    </Grid>
                }
                {account &&
                    <Grid container spacing={2} sx={{ height: "wrap-content", width: '90%', display: "flex", flexDirection: "column", marginBottom: 2 }}>
                        <Grid item display={"flex"} flexDirection="row" alignItems="center">
                            <h1 style={{ color: "#FE9384" }}>Quick Actions</h1>
                            {!showQuickActions && <UpCaret onClick={toggleQuickActions} />}
                            {showQuickActions && <DownCaret onClick={toggleQuickActions} />}
                        </Grid>
                        <div ref={quickActionsRef} style={quickActionsStyles}>
                            <Grid container spacing={2} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                                {notUpdatedInRows.length !== 0 && <Grid item sx={{ width: "fit-content" }}>
                                    <DataGrid
                                        rows={notUpdatedInRows}
                                        columns={notUpdatedInColumns}
                                        initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                                        hideFooter
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                        onCellClick={handleDriveNameClick}
                                        getRowClassName={setRowClassName}

                                    />
                                </Grid>}
                                {shipmentsPendingRows.length !== 0 && <Grid item sx={{ width: "fit-content" }}>
                                    <DataGrid
                                        rows={shipmentsPendingRows}
                                        columns={shipmentsPendingColumns}
                                        initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                                        checkboxSelection
                                        hideFooter
                                        disableRowSelectionOnClick
                                        onCellClick={handleDriveNameClick}
                                        getRowClassName={setRowClassName}

                                    />
                                </Grid>}
                                {reactivationReqRows.length !== 0 && <Grid item sx={{ width: "fit-content" }}>
                                    <DataGrid
                                        rows={reactivationReqRows}
                                        columns={reactivationReqColumns}
                                        initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                                        checkboxSelection
                                        hideFooter
                                        disableRowSelectionOnClick
                                        onCellClick={handleDriveNameClick}
                                        getRowClassName={setRowClassName}

                                    />
                                </Grid>}
                            </Grid>
                        </div>
                    </Grid>
                }
                {account && currDrivesGridRows && currDrivesGridColumns && currDrivesGridRows.length !== 0 && driveData &&
                    <Grid container spacing={2} sx={{ height: "wrap-content", width: '90%', display: "flex", flexDirection: "column" }}>
                        <Grid item display="flex" flexDirection="row" alignItems="center">
                            <h1 style={{ color: "#FE9384" }}>Current Drives</h1>
                            {!showCurrDrives && <UpCaret onClick={setShowCurrDrives} />}
                            {showCurrDrives && <DownCaret onClick={setShowCurrDrives} />}
                        </Grid>
                        <div ref={currDriveTableRef} style={currDriveTableStyles}>
                            <Grid item sx={{ width: "fit-content" }}>
                                <DataGrid
                                    rows={currDrivesGridRows}
                                    columns={currDrivesGridColumns}
                                    initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                                    checkboxSelection
                                    hideFooter
                                    disableRowSelectionOnClick
                                    onCellClick={handleDriveNameClick}
                                    getRowClassName={setRowClassName}

                                />
                            </Grid>
                        </div>
                        <Grid item display="flex" flexDirection="row" alignItems="center">
                            <h1 style={{ color: "#FE9384" }}>Completed Drives</h1>
                            {!showCompletedDrives && <UpCaret onClick={toggleShowCompletedDrives} />}
                            {showCompletedDrives && <DownCaret onClick={toggleShowCompletedDrives} />}
                        </Grid>
                        <div ref={completedDriveTableRef} style={completedDriveTableStyles}>
                            {completedDrivesGridRows.length !== 0 && <Grid item sx={{ width: "fit-content" }}>
                                <DataGrid
                                    rows={completedDrivesGridRows}
                                    columns={completedDrivesColumns}
                                    initialState={{ pagination: { paginationModel: { pageSize: 10 }, }, }} pageSizeOptions={[10]}
                                    checkboxSelection
                                    hideFooter
                                    disableRowSelectionOnClick
                                    onCellClick={handleDriveNameClick}
                                />
                            </Grid>}
                        </div>
                    </Grid>}
                {sidebarDriveDatum && <div ref={sidebarRef} style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    overflowY: showSidebar ? 'scroll' : "hidden",
                    background: '#F5F5F5',
                    padding: '15px',
                    boxSizing: 'border-box',
                    transformOrigin: 'top right',
                    transform: 'scale(1)',
                    minWidth: showSidebar? '400px' : 0,
                    transition: 'width .4s ease',
                    width: showSidebar ? '36%' : 0
                }}><AdminSidebar email={account.email} updateBookDriveStatus={updateBookDriveStatus} volunteer={sidebarDriveDatum.volunteer} drive={sidebarDriveDatum.drive} shipments={sidebarDriveDatum.shipments} />
                </div>}
            </Grid>
        </>)
}

export default AdminDashboard

export const getServerSideProps = async (context: any) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        // console.log("session obj", session)
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
        if (!account) throw new Error(`account with email ${session.user.email}`)
        // console.log("account", account)
        // const volunteerList = account.volunteerIds
        const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
        // const vPromises = volunteerList.map(volunteerId => VolunteerAccount.findOne({ alp_id: volunteerId }))
        // const volunteers = await Promise.all(vPromises) as VolunteerAccount[]
        // console.log("volunteers", volunteers)
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
        // console.log(driveData)
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), driveData: JSON.parse(JSON.stringify(driveData)) } }
    } catch (e: Error | any) {
        console.log(e)
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, drives: null, volunteers: null } }
    }
}