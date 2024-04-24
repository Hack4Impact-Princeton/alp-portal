import { AdminAccount } from "../models/AdminAccount"
import { VolunteerAccount } from "../models/VolunteerAccount"
import mongoose from "mongoose"
import genUniqueId from "../lib/idGen"
const addNewAdmin = async(user: VolunteerAccount) => {
    try {
        const newAdmin: AdminAccount = {
            id:genUniqueId(),
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            alp_id: user.alp_id,
            pwhash: user.pwhash,
            broadcasts: [],
            isSuperAdmin: false,
            city: user.city,
            state: user.state,
            country: user.country,
            affiliation: user.affiliation,
            role: [],
        }
        console.log(JSON.stringify(newAdmin))
        const res = await fetch(`/api/adminAccounts/${newAdmin.email}`, {
            method: "POST",
            body: JSON.stringify(newAdmin)
        })
        if (!res) throw new Error("Internal server error")
        const resJson = await res.json()
        if (res.status !== 200) throw new Error(resJson.data)
        console.log("success adding new admin", resJson.data)
        return {success: true, newAdmin: resJson.data}
    } catch (e: Error | any) {
        console.error('Error adding new admin', e);
        return {success: false, error: e}
    }
}

export default addNewAdmin