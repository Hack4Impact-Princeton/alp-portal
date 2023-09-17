import { ReactivationRequest } from "../models/ReactivationRequest"
import genUniqueId from "../lib/idGen"
const sendReactivationReq = async (driveCode: string, volunteerId: number, message: string) => {
    try {
        if (message === '') throw new Error("Message cannot be empty")
        const reactivationReq: ReactivationRequest = {
            id: genUniqueId(),
            driveCode: driveCode,
            volunteerId: volunteerId,
            date: new Date(),
            message: message,
            status: "pending",
        }
        const res = await fetch(`/api/reactivationRequest/${reactivationReq.id}`, {
            method: "POST",
            body: JSON.stringify(reactivationReq)
        })
        if (!res) throw new Error("Internal server error - Reactivation Request could not be sent")
        const reactivationReqJson = await res.json()
        if (res.status !== 200) throw new Error(reactivationReqJson.data)
        console.log("successfully sent out the reactivation request", reactivationReqJson.data)
        const driveRes = await fetch(`/api/bookDrive/${driveCode}`, {
            method: "PUT",
            body: JSON.stringify({ reactivationRequestId: reactivationReq.id })
        })
        if (!driveRes) {
            await fetch(`/api/reactivationRequest/${reactivationReq.id}`, {
                method: "DELETE",
            })
            throw new Error('Internal Server Error')
        }
        const driveResJson = await driveRes.json()
        if (driveRes.status !== 200) throw new Error("Internal Server Error - Bookdrive could not be updated")
        return { success: true, reactivationReq: reactivationReqJson.data, drive: driveResJson.data }
    } catch (e: Error | any) {
        console.error('Error while sending email', e);
        return { success: false, error: e }
    }
}

export const deleteReactivationRequest = async (driveCode: string, reactivationReqId: string) => {
    try {
        const driveRes = await fetch(`/api/bookDrive/${driveCode}`, {
            method: "PUT",
            body: JSON.stringify({ reactivationRequestId: null })
        })
        if (!driveRes) throw new Error("something went wrong while deleting the reactivation request from the bookdrive")
        const reactivationReq = await fetch(`/api/reactivationRequest/${reactivationReqId}`, {
            method: "DELETE",
        })
        if (!reactivationReq) {
            throw new Error("something went wrong deleting the reactivationreq entry")
        }
        const resJson = await reactivationReq.json()
        return {success: true, reactivationReq: resJson.data}
    } catch (e: Error | any) {
        console.error(`Error : ${e}`)
        return { success: false, error: e }
    }
}

export const editReactivationRequest = async (reactivationReqId: string, message: string) => {
    try {
        if (message === '') return {success: false, error: new Error("Message cannot be empty")}
        const update = {
            message: message,
            date: new Date(),
        }
        const res = await fetch(`/api/reactivationRequest/${reactivationReqId}`, {
            method: "PATCH",
            body: JSON.stringify(update)
        })
        const resJson = await res.json()
        if (!res.ok) throw new Error(resJson.data)
        if (!resJson.data) throw new Error("Something went wrong")
        console.log(resJson.data)
        return { success: true, reactivationReq: resJson.data}
    } catch (e: Error | any) {
        console.error(e)
        return { success: false, error: e }
    }
}


export default sendReactivationReq