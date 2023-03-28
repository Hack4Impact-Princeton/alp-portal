import VolunteerAccount from '../../../models/VolunteerAccount'
import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel from '../../../models/VolunteerAccount'


// right now a lot of the data is hard-coded
const handler = async(req, res) => {
    try {
        if (req.method == "POST") {
            const {email, password} = JSON.parse(req.body)
            await dbConnect()
            const VolunteerAccount = getVolunteerAccountModel()
            const volunteerAccount = new VolunteerAccount({
                fname: "test_fname.2",
                lname: "test_lname.2",
                alp_id: 2,
                ageBucket: 1,
                email: email,
                pwhash: password,
                location: 5,
                dateJoined: Date.now(),
                allDrives: 0,
                badges: 0
            })
            await volunteerAccount.save()
            res.json(volunteerAccount)
        }
    }  catch (e) {
        console.error(e)
    }
}
export default handler