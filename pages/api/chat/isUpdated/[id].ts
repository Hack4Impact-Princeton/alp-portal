import { NextApiRequest, NextApiResponse } from "next";
import getChatModel, {Chat} from "../../../../models/Chat";
import mongoose from 'mongoose'

// chacks to see whether the current chat has been updated
const handler = async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        const id = req.query.id
        let length
        if (req.query.length && typeof req.query.length === 'string') {
            length = parseInt(req.query.length)
        } else throw new Error("the length query parameter must be a string")
        const ChatModel: mongoose.Model<Chat> = getChatModel()
        const chat = await ChatModel.findOne({id: id})
        if (!chat) throw new Error(`Chat with id ${id} not found`)
        // if db chat length > query length, it needs to be updated
        if (chat.messages.length > length) {
            return res.status(200).json(chat)
        } else return res.status(204).end()
    } catch (e: Error | any) {
        console.error(e)
        return res.status(500)
    }
}
export default handler