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
    // const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    switch (req.method) {
        case 'POST':
            try {
                // parse the new broadcast information
                const broadcastInfo: Broadcast = JSON.parse(req.body)
                const errorStrings: string[] = []
                // update the sender's broadcast array
                const updatedSender = await VolunteerAccount.findOneAndUpdate({ email: broadcastInfo.senderEmail }, { $push: { broadcasts: { $each: [broadcastInfo.id], $position: 0 } } }, { new: true })
                if (!updatedSender) throw new Error("Failure to add broadcast to admin")
                broadcastInfo.receiverEmails.map(async email => {
                    const volunteerRecipient = await VolunteerAccount.findOneAndUpdate({ email: email }, {
                        $push: {
                            broadcasts: {
                                $each: [broadcastInfo.id],
                                $position: 0
                            }
                        }
                    })
                    if (!volunteerRecipient) errorStrings.push(`Delivery failed to ${email}`)
                })
                // create a new broadcast and save it.
                const broadcast = new Broadcast(broadcastInfo)
                if (!broadcast) return res.status(400).json({ success: false, data: 'error creating broadcast' })
                await broadcast.save()
                console.log("broadcast created", broadcast)
                // if failed to deliver to at least one person
                if (errorStrings.length !== 0) {
                    let errorString = ""
                    errorStrings.forEach(eString => errorString += eString + "\n")
                    throw new Error(errorString)
                }
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