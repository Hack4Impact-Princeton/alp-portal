import mongoose from 'mongoose'
const {Schema} = mongoose

const VolunteerAccountSchema = new Schema({
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
    alp_id: {
        type: Number,
        required: true
    },
    ageBucket: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pwhash: {
        type: String,
        required: true
    },
    location: {
        type: Number,
        required: true
    },
    dateJoined: {
        type: Date,
        required: true
    },
    allDrives: {
        type: Number,
        required: true
    },
    driveIds: {
        type: Array,
        required: true
    },
    badges: {
        type: Number,
        required: true
    },
}, {collection: 'volunteerAccounts'})


function getVolunteerAccountModel() {
    if ("VolunteerAccount" in mongoose.models) {
        return mongoose.models.VolunteerAccount
    }
    return mongoose.model("VolunteerAccount", VolunteerAccountSchema)
}
export default getVolunteerAccountModel


