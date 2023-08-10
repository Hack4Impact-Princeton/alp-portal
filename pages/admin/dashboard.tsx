import {getServerSession} from 'next-auth/next'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import mongoose from 'mongoose';
import { BookDriveStatus } from '../../lib/enums';
import { authOptions } from '../api/auth/[...nextauth]';
import {DataGrid} from '@mui/x-data-grid'
import getShipmentModel, { Shipment } from '../../models/Shipment';
import { Box } from '@mui/material';
import React from 'react';
type AdminDashboardProps = {
    account: AdminAccount;
    volunteers: VolunteerAccount[];
    error: Error | null;
    driveData: { drive: BookDrive, shipments: Shipment[] }[];

}
const AdminDashboard: NextPage<AdminDashboardProps> = ({ account, volunteers, driveData, error }) => {
    console.log(account)
    console.log(volunteers)
    const drives = driveData.map(driveDatum => driveDatum.drive)
    console.log(drives)

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
        } catch (e: Error | any) {
            console.error(e)
        }
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
            console.log(resJson.data)
        } catch (e: Error | any) {
            console.error(e)
        }
    }
    return (
        <>
            {account &&
                <>
                    {account && <p>{account.fname} {account.lname}</p>}
                    {volunteers && volunteers.map(volunteer => <p key={volunteer.alp_id}>{volunteer.email}</p>)}
                    {driveData && driveData.map(driveDatum => {
                        return (
                            <Box key={driveDatum.drive.driveCode}>
                                <p>{driveDatum.drive.driveName}</p>
                                <ol key={driveDatum.drive.driveCode}>
                                    {driveDatum.shipments &&
                                        driveDatum.shipments.map(shipment => { return (<React.Fragment key={shipment.id}><li >{shipment.id}</li> <button onClick={() => markShipmentReception(shipment.id)}>Mark as Received</button></React.Fragment>) })
                                    }
                                </ol>
                            </Box>

                        )
                    })}
                </>}
        </>)
}

export default AdminDashboard

export const getServerSideProps = async (context: any) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
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
        return { props: { error: errorStr, account: null, volunteers: null, driveData: null } }
    }
}