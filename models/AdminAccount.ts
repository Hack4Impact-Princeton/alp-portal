import mongoose from 'mongoose'
import {Schema, Document, Types} from 'mongoose'

export interface AdminAccount extends Document {
    fname: string,
    lname: string,
    email: string,
    pwhash: string,
    alp_id: string,
    broadcasts: string[],
    volunteerIds: number[],
    driveIds: string[],
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
    broadcasts: {type: [String]},
    volunteerIds: [Number], 
    driveIds: [String]
}, {collection: 'adminAccounts'})


function getAdminAccountModel() {
    // ^?
    if ("AdminAccount" in mongoose.models) {
        return mongoose.models.AdminAccount
    }
    return mongoose.model("AdminAccount", AdminAccountSchema)
}
export default getAdminAccountModel


