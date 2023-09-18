import { NextApiRequest, NextApiResponse } from "next";
import getBroadcastModel from "../../../models/Broadcast";
import dbConnect from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { Broadcast } from "../../../models/Broadcast";
import getAdminAccountModel, { AdminAccount } from "../../../models/AdminAccount";
import getVolunteerAccountModel, { VolunteerAccount } from "../../../models/VolunteerAccount";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id
    await dbConnect()
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel()
    const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                // parse the new broadcast information
                const broadcastInfo: Broadcast = JSON.parse(req.body)
                // find the sender among the admin accounts
                const sender = await AdminAccount.findOne({ email: broadcastInfo.senderEmail })
                if (!sender) return res.status(400).json({ success: false, data: `no admin account found with email ${broadcastInfo.senderEmail}` })
                // make sure that all of the receiveremails belong to volunteers
                broadcastInfo.receiverEmails.map(async email => {
                    if (!await VolunteerAccount.findOne({ email: email }))
                        return res.status(400).json({ success: false, data: `no receiver found with email ${email}` })
                })
                // update the sender's broadcast array
                sender.updateOne({ $push: { broadcasts: broadcastInfo.id } }).exec()
                // update the receivers broadcast array
                broadcastInfo.receiverEmails.map(async email => {
                    await VolunteerAccount.findOneAndUpdate({ email: email }, {
                        $push: {
                            broadcasts: {
                                $each: [broadcastInfo.id],
                                $position: 0
                            }
                        }
                    })
                })
                // create a new broadcast and save it.
                const broadcast = new Broadcast(broadcastInfo)
                if (!broadcast) return res.status(400).json({ success: false, data: 'error creating broadcast' })
                await broadcast.save()
                console.log("broadcast created", broadcast)
                return res.status(200).json({ success: true, data: broadcast })
            } catch (e: Error | any) {
                return res.status(500).json({ success: false, data: e })
            }
        case 'GET':
            try {
                const broadcast = await Broadcast.findOne({ id: id })
                if (!broadcast) return res.status(400).json({ success: false, data: `No broadcast found with id ${id}` })
                return res.status(200).json({ success: true, data: broadcast })
            } catch (e: Error | any) {
                return res.status(500).json({ success: false, data: e })
            }
    }
}

export default handler