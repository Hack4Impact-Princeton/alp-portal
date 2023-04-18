import { FlashAuto, FlashOnOutlined } from '@mui/icons-material'
import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel from '../../../models/VolunteerAccount'

// right now a lot of the data is hard-coded
export default async function handler(req, res) {
    await dbConnect()
    const VolunteerAccount = getVolunteerAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                var maxAlpId
                await VolunteerAccount.findOne().sort('-alp_id').then(account => {
                    maxAlpId = account.alp_id
                })
                console.log(maxAlpId)
                const {email, password, fname, lname} = JSON.parse(req.body)
                const newVolunteerAccount = new VolunteerAccount({
                    fname: fname,
                    lname: lname,
                    alp_id: maxAlpId+1,
                    ageBucket: 1,
                    email: email,
                    pwhash: password,
                    location: 5,
                    dateJoined: Date.now(),
                    allDrives: 0,
                    badges: 0
                })
                const account = await newVolunteerAccount.save()
                res.status(200).json({success: true, data: account}) 
                break
            } catch (error) {
                res.status(400).json({ success: false, data: error })
                break
            }
        case 'PATCH':
            try {
               const {alp_id, email, password, fname, lname} = JSON.parse(req.body)
               const account = await VolunteerAccount.findOneAndUpdate(
                {alp_id: alp_id}, 
                {fname: fname, lname: lname, email: email, pwhash: password}
                )
               const modifiedVolunteerAccount = await account.save()
               res.status(200).json({success: true, data: modifiedVolunteerAccount}) 
               break
            } catch (error) {
                res.status(400).json({success: false, data: error})
                break
            }
        case 'DELETE':
            try {
                const {alp_id} = JSON.parse(req.body)
                const account = await VolunteerAccount.delete({alp_id: alp_id})
                const deletedVolunteerAccount = await account.save()
                res.status(200).json({success: true, data: deletedVolunteerAccount})
                break
            } catch (error) {
                res.status(400).json({success: false, data: error})
                break
            }
        case 'GET':
            try {
                const {alp_id} = JSON.parse(req.body)
                const volunteerAccount = await VolunteerAccount.find({alp_id: alp_id})
                res.status(200).json({success: true, data: volunteerAccount})
                break
            } catch (error) {
                res.status(400).json({success: false, data: error})
            }
    }

}
