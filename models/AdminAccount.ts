import mongoose from 'mongoose'
import {Schema, Document, Types} from 'mongoose'


export type AdminAccount = {
    id: string,
    fname: string,
    lname: string,
    email: string,
    pwhash: string,
    alp_id: number,
    broadcasts: string[],
    isSuperAdmin: boolean,
    city: string,
    state: string,
    country: string,
    affiliation: string,
    role: string[],
}

export const AdminAccountSchema = new Schema<AdminAccount>({
    id: {
        type:String,
    },
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
    alp_id: {type: Number, required: true},
    broadcasts: {type: [String], required:true    },
    isSuperAdmin: {type: Boolean, required:true,
    },

    city: {
        type: String,
        required:true,
        default: ""

    },
    state: {
        type: String,
        required:true,
        default: ""

    },
    country: {
        type: String,
        required:true,
        default: ""

    },
    affiliation: {
        type: String,
        required:true,
        default: ""

    },
    role: {
        type: [String], required:false   
    }
   

   
}, {collection: 'adminAccounts'})


function getAdminAccountModel() {
    if ("AdminAccount" in mongoose.models) {
        return mongoose.models.AdminAccount;
    }
    return mongoose.model("AdminAccount", AdminAccountSchema)
}
export default getAdminAccountModel


