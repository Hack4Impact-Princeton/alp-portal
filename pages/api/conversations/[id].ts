import dbConnect from '../../../lib/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import getExtendedConversationParamsModel, { ExtendedConversationParamsDocument } from '../../../models/Conversation'
import { MessageContentType } from '@chatscope/use-chat'
// right now a lot of the data is hard-coded
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = req.query.id
        await dbConnect()
        const Conversation: mongoose.Model<ExtendedConversationParamsDocument<any, MessageContentType>> = getExtendedConversationParamsModel()
        // get email and update
        const {message} = JSON.parse(req.body)
        console.log(message)
        const modifiedConversation = await Conversation.findOneAndUpdate(
            { id: id },
            { $push: {messages: message} }, {
            new: true,
        })
        if (!modifiedConversation) return res.status(400).json({success: false, data: null})
        res.status(200).json({ success: true, data: modifiedConversation })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, data: error })
    }
}
