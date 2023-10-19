import { Broadcast } from "../models/Broadcast";
import { VolunteerAccount } from "../models/VolunteerAccount";
import { AdminAccount } from "../models/AdminAccount";
import { BookDrive } from "../models/BookDrive";
import { ReactivationRequest } from "../models/ReactivationRequest";

export const setCachedVolunteerAccount = (account : VolunteerAccount) => {
    sessionStorage.setItem('volunteerAccount', JSON.stringify(account))
}
export const getCachedVolunteerAccount = () => {
    if (typeof window !== undefined) {
        const accountString = sessionStorage.getItem('volunteerAccount')
        if (!accountString) return {accountSuccess: false, accountMessage: "could not find cached volunteer account"}
        return {accountSuccess: true, cachedAccount: JSON.parse(accountString)}

    } else {
        return {accountSuccess: false, accountMessage: "You can't access the sessionStorage from the server"}
    }
}
export const setCachedDriveData = (driveData: {drive: BookDrive, reactivationReq: ReactivationRequest | null}[]) => {
    sessionStorage.setItem('drives', JSON.stringify(driveData))
}
export const getCachedDriveData = () => {
    if (typeof window !== undefined) {

        const driveString = sessionStorage.getItem('driveData')
        if (!driveString) return {drivesSuccess: false, drivesMessage: "could not find cached driveData"}
        return {drivesSuccess: true, cachedDriveData: JSON.parse(driveString)}
    } else return {drivesSuccess: false, drivesMessage: "You can't access sessionStorage from the server"}
}

export const setCachedBroadcasts = (broadcasts: Broadcast[]) => {
    sessionStorage.setItem('broadcasts', JSON.stringify(broadcasts))
}
export const getCachedBroadcasts = () => {
    const broadcastsString = sessionStorage.getItem('broadcasts')
    if (!broadcastsString) return {success: false, broadcastsMessage: "Could not find cached broadcasts"}
    return {broadcastsSuccess: true, cachedBroadcasts: JSON.parse(broadcastsString)}
}

export const setCachedAdminAccount = (account: AdminAccount) => {
    sessionStorage.setItem('adminAccount', JSON.stringify(account))
}

export const getCachedAdminAccount = ()=> {
    const adminAccountString = sessionStorage.getItem('adminAccount')
    if (!adminAccountString) return {success: false, accountMessage: "could not find cached admin account"}
    return {accountSuccess: true, cachedAccount: JSON.parse(adminAccountString)}
}