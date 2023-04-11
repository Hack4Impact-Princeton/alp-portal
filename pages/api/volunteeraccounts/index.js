import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel from '../../../models/VolunteerAccount'

// right now a lot of the data is hard-coded
export default async function handler(req, res) {
    await dbConnect()
    const VolunteerAccount = getVolunteerAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                const {email, password, fname, lname} = JSON.parse(req.body)
                const volunteerAccount = new VolunteerAccount({
                    fname: fname,
                    lname: lname,
                    alp_id: 2,
                    ageBucket: 1,
                    email: email,
                    pwhash: password,
                    location: 5,
                    dateJoined: Date.now(),
                    allDrives: 0,
                    badges: 0
                })
                const account = await volunteerAccount.save()
                res.status(200).json({success: true, data: account}) 
                break
            } catch (error) {
                res.status(400).json({ success: false, data: error })
                break
            }
            
    }

}
