import mongoose from 'mongoose'
import {Schema, Types} from 'mongoose'

export type AdminAccount = {
    fname: string,
    lname: string,
    email: string,
    pwhash: string,
    id: string,
    isAdmin: boolean,
    name: string,
}

const AdminAccountSchema = new Schema<AdminAccount>({
    fname: {
        type: String,
        required: true,
        default: "default_fname"
    },
    lname: {
        type: String,
        required: true,
        default: "default_lname"
    },
    email: {
        type: String,
        required: true
    },
    pwhash: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, {collection: 'adminAccounts'})


function getAdminAccountModel() {
    // ^?
    if ("AdminAccount" in mongoose.models) {
        return mongoose.models.AdminAccount
    }
    return mongoose.model("AdminAccount", AdminAccountSchema)
}
export default getAdminAccountModel


