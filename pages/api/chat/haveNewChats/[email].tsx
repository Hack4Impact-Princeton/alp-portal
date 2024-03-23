import { NextApiRequest, NextApiResponse } from "next";
import getChatModel, { Chat } from "../../../../models/Chat";
import mongoose from 'mongoose'
import getVolunteerAccountModel, { VolunteerAccount } from "../../../../models/VolunteerAccount";

// chacks to see whether the current chat has been updated
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log("received request in api")
        const email = req.query.email
        let currNumChats
        if (req.query.currNumChats && typeof req.query.currNumChats === 'string') {
            currNumChats = parseInt(req.query.currNumChats)
        } else throw new Error("the currNumChats query parameter must be a string")
        const VolunteerAccountModel: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
        const ChatModel: mongoose.Model<Chat> = getChatModel()
        const user = await VolunteerAccountModel.findOne({ email: email })
        if (!user) throw new Error(`user with email ${email} not found`)
        // if db chat length > query length, it needs to be updated
        console.log("currNumChats", currNumChats)
        if (user.chatIds.length > currNumChats) {
            console.log("inside the condition")
            let newChats = []
            for (let i = currNumChats; i < user.chatIds.length; i++) {
                const chat = await ChatModel.findOne({ id: user.chatIds[i] })
                if (!chat) throw new Error(`chat with id ${user.chatIds[i]} not found`)
                newChats.unshift(chat)
            }
            console.log("about to return something")
            return res.status(200).json(newChats)
        } else {
            console.log("nothing different")
            return res.status(204).end()
        }
    } catch (e: Error | any) {
        console.error(e)
        return res.status(500)
    }
}
export default handler