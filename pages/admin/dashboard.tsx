import { getSession } from 'next-auth/react'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import mongoose from 'mongoose';
import { Box } from '@mui/material';
import { BookDriveStatus } from '../../lib/enums';
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
                <div>
                    {account && <p>{account.fname} {account.lname}</p>}
                    {volunteers && volunteers.map(volunteer => <p>{volunteer.email}</p>)}
                    {drives && drives.map(drive => {
                        return (
                            <Box sx={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <p>{drive.driveName}</p>
                                <button onClick={() => updateBookDriveStatus(drive.driveCode, BookDriveStatus.Active)}>{`Mark ${drive.driveName} as active`}</button>
                                <button onClick={() => updateBookDriveStatus(drive.driveCode, BookDriveStatus.Cancelled)}>{`Mark ${drive.driveName} as cancelled`}</button>
                            </Box>
                        )
                    })}
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
        const driveList = account.driveIds
        const bPromises = driveList.map(driveId => BookDrive.findOne({ driveCode: driveId }))
        const drives = await Promise.all(bPromises) as BookDrive[]
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), drives: JSON.parse(JSON.stringify(drives)) } }
    } catch (e: Error | any) {
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, drives: null, volunteers: null } }
    }
}