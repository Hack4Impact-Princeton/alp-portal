import dbConnect from '../lib/dbConnect'
import getVolunteerAccountModel from '../models/VolunteerAccount'
async function signUp() {
    try {
        await dbConnect()
        const VolunteerAccount = getVolunteerAccountModel()
        const volunteerAccount = new VolunteerAccount({
            fname: "test_fname",
            lname: "test_lname",
            alp_id: 1,
            ageBucket: 1,
            email: "test@gmail.com",
            pwhash: "test_password",
            location: 1,
            dateJoined: Date.now(),
            allDrives: 0,
            badges: 0
        }) 
        await volunteerAccount.save()
        return {email: "this worked", password: "this worked"}
    } catch (e) {
        console.error(e)
    }
    return {email: "this worked", password: "this worked"}
}

export default signUp