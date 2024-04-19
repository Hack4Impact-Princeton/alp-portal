import { FlashAuto, FlashOnOutlined } from '@mui/icons-material'
import dbConnect from '../../../lib/dbConnect'
import getAdminAccountModel, { AdminAccount } from '../../../models/AdminAccount'
import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
// right now a lot of the data is hard-coded
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const queryEmail = req.query.email
    await dbConnect()
    const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                if (await AdminAccount.exists({email: queryEmail})) {
                    console.log(`adminaccount already exists with this email ${queryEmail}`)
                    return res.status(400).json({success: false, data: null})
                }
                
                const { id,
                    fname,
                    lname,
                    email,
                    alp_id,
                    pwhash,
                    broadcasts,
                    isSuperAdmin,
                    city,
                    state,
                    country,
                    affiliation} = JSON.parse(req.body)
                console.log(req.body)
                if (email != queryEmail) {
                    console.log(`query email doesn't match body email`)
                    return res.status(400).json({success: false, data: null})
                }
                // find largest existing alp id and then give the new user one more than that
                let maxAlpId = 0
                await AdminAccount.findOne().sort('-alp_id').then(account => {
                    maxAlpId = account!.alp_id
                })
                console.log(maxAlpId)
                const newAdminAccount = new AdminAccount({
                    id:id,
                    fname: fname,
                    lname: lname,
                    email: email,
                    alp_id: alp_id,
                    pwhash: pwhash,
                    broadcasts: broadcasts,
                    isSuperAdmin: isSuperAdmin,
                    city: 'testing??',
                    state: state,
                    country: country,
                    affiliation: affiliation
                })
               // console.log(newAdminAccount)
                const account = await newAdminAccount.save()
                res.status(200).json({ success: true, data: account})
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'PATCH': // edit volunteer by email
            try {
                // get email and update
                const update = JSON.parse(req.body)
                const modifiedAccount = await AdminAccount.findOneAndUpdate(
                    { email: queryEmail },
                    update, {
                    new: true,
                    runValidators: true,
                })
                if (!modifiedAccount) return res.status(400).json({success: false, data: null})
                res.status(200).json({ success: true, data: modifiedAccount })
            } catch (error) {
                console.log(error)
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'DELETE':
            try {
                const account: AdminAccount | null = await AdminAccount.findOneAndDelete({ email: queryEmail })
                if (!account) return res.status(400).json({success: false, data: null})
                res.status(200).json({ success: true, data: account })
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
            break
        case 'GET':
            try {
                const account = await AdminAccount.findOne({ email: queryEmail })
                if (!account) return res.status(400).json({ success: false, data: null })
                res.status(200).json({ success: true, data: account })
            } catch (error) {
                res.status(400).json({ success: false, data: error })
            }
    }
}
