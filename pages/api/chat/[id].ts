import { NextApiRequest, NextApiResponse } from "next";
import getChatModel from "../../../models/Chat";
import dbConnect from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { Chat } from "../../../models/Chat";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id
    await dbConnect()
    const ChatModel: mongoose.Model<Chat> = getChatModel()
    switch (req.method) {
        case 'POST':
            try {
                if (await ChatModel.exists({id: id})) {
                    console.error(`Chat with id ${id} already exists`)
                    throw new Error(`Chat with id ${id} already exists`)
                }
                const chatBody: Chat = JSON.parse(req.body)
                if (await ChatModel.exists({participantAEmail: chatBody.participantAEmail, participantBEmail: chatBody.participantBEmail})
                    || await ChatModel.exists({participantAEmail: chatBody.participantBEmail, participantBEmail: chatBody.participantAEmail})) {
                    console.error(`chat with ${chatBody.participantAEmail} and ${chatBody.participantBEmail} already exists`)
                    return res.status(403).json({message: "chat already exists"})
                }
                const newChat = new ChatModel(chatBody)
                if (!newChat) throw new Error(`Error creating chat with id ${id}`)
                await newChat.save()
                return res.status(200).json({ success: true, data: newChat })
            } catch (e: Error | any) {
                console.error(e.message)
                return res.status(500).json({ success: false, data: e })
            }
        case 'GET':
            try {
                const chat = await ChatModel.findOne({ id: id })
                console.log(chat)
                if (!chat) return res.status(400).json({ success: false, data: `No chat found with id ${id}` })
                return res.status(200).json({ success: true, data: chat })
            } catch (e: Error | any) {
                console.error(e)
                return res.status(500).json({ success: false, data: e })
            }
        case 'PATCH':
            try {
                const update = JSON.parse(req.body)
                const chat = await ChatModel.findOneAndUpdate({id: id}, update, {
                    new: true,
                    runValidators: true,
                })
                if (!chat) throw new Error(`Failure to update chat with id ${id}`)
                console.log("returning these chat messages", chat.messages)
                return res.status(200).json({success: true, data: chat})
            } catch (e : Error | any) {
                console.error(e)
                return res.status(500).json({success: false, data: e})
            }
        case 'DELETE':
            try {
                const deletedChat = await ChatModel.findOneAndDelete({id: id})
                if (!deletedChat) throw new Error(`failed to delete chat with id ${id}`)
                return res.status(200).json({success: true, data: deletedChat})
            } catch (e: Error | any) {
                console.error(e)
                return res.status(500).json({success: false, error: e})
            }
    }
}

export default handler