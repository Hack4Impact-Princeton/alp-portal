import { FlashAuto, FlashOnOutlined } from '@mui/icons-material'
import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel, { VolunteerAccount } from '../../../models/VolunteerAccount'
import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
// right now a lot of the data is hard-coded
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const queryEmail = req.query.email
    await dbConnect()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                if (await VolunteerAccount.exists({email: queryEmail})) {
                    console.log(`volunteeraccount already exists with this email ${queryEmail}`)
                    return res.status(400).json({success: false, data: null})
                }
                const { email, pwhash, fname, lname, location } = JSON.parse(req.body)
                if (email != queryEmail) {
                    console.log(`query email doesn't match body email`)
                    return res.status(400).json({success: false, data: null})
                }
                // find largest existing alp id and then give the new user one more than that
                let maxAlpId = 0
                await VolunteerAccount.findOne().sort('-alp_id').then(account => {
                    maxAlpId = account!.alp_id
                })
                console.log(maxAlpId)
                const newVolunteerAccount = new VolunteerAccount({
                    fname: fname,
                    lname: lname,
                    alp_id: maxAlpId + 1,
                    ageBucket: 1,
                    email: email,
                    pwhash: pwhash,
                    location: location,
                    startDate: new Date().toLocaleDateString(),
                    allDrives: 0,
                    badges: 0,
                    driveIds: []
                })
                console.log(newVolunteerAccount.startDate)
                const account = await newVolunteerAccount.save()
                res.status(200).json({ success: true, data: account})
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'PATCH': // edit volunteer by email
            try {
                // get email and update
                const update = JSON.parse(req.body)
                const modifiedVolunteerAccount = await VolunteerAccount.findOneAndUpdate(
                    { email: queryEmail },
                    update, {
                    new: true,
                    runValidators: true,
                })
                if (!modifiedVolunteerAccount) return res.status(400).json({success: false, data: null})
                res.status(200).json({ success: true, data: modifiedVolunteerAccount })
            } catch (error) {
                console.log(error)
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'DELETE':
            try {
                const account: VolunteerAccount | null = await VolunteerAccount.findOneAndDelete({ email: queryEmail })
                if (!account) return res.status(400).json({success: false, data: null})
                res.status(200).json({ success: true, data: account })
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'GET':
            try {
                const volunteerAccount = await VolunteerAccount.findOne({ email: queryEmail })
                if (!volunteerAccount) return res.status(400).json({ success: false, data: null })
                res.status(200).json({ success: true, data: volunteerAccount })
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
    }
}
