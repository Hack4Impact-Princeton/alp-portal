import {getServerSession} from 'next-auth/next'
import { NextPage } from 'next/types'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount';
import getBookDriveModel, { BookDrive } from '../../models/BookDrive';
import mongoose from 'mongoose';
import { authOptions } from '../api/auth/[...nextauth]';
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
    
    return (
    <>
        {account && 
        <div>
            {account && <p>{account.fname} {account.lname}</p>}
            {volunteers && volunteers.map(volunteer => <p>{volunteer.email}</p>)}
            {drives && drives.map(drive => <p>{drive.driveName}</p>)}
        </div>}
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
        const driveList = account.driveIds
        const bPromises = driveList.map(driveId => BookDrive.findOne({ driveCode: driveId }))
        const drives = await Promise.all(bPromises) as BookDrive[]
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), drives: JSON.parse(JSON.stringify(drives)) } }
    } catch (e: Error | any) {
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return {props: {error: errorStr, account: null, drives: null, volunteers: null}}
    }
}