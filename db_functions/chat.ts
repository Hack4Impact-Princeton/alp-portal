import { Message} from '../models/Chat'
import genUniqueId from '../lib/idGen'
import { VolunteerAccount } from '../models/VolunteerAccount'
import getChatModel, {Chat} from '../models/Chat'
import getVolunteerAccountModel from '../models/VolunteerAccount'
import mongoose from 'mongoose'
const createChat = async(participantBEmail: string, participantA: VolunteerAccount)  => {
    try {
        const chatId = genUniqueId()
        const body = {  
            participantAEmail: participantA.email,
            participantBEmail,
            id: chatId,
            messages: []
        }
        const res = await fetch(`/api/chat/${body.id}`, {
            method: "POST",
            body: JSON.stringify(body)
        })
        if (!res) throw new Error("Internal Server Error")
        if (res.status === 403) throw new Error("chat with these participants already exists")
        const resJson = await res.json()
        const newChatId = resJson.data.id
        if (!res.ok) throw new Error(`Something went wrong creating a chat between ${participantA.email} and ${participantBEmail}`)
        const participantBRes = await fetch(`/api/volunteeraccounts/${participantBEmail}`)
        const participantBResJson = await participantBRes.json()
        const participantB = participantBResJson.data
        if (!participantBRes.ok) {
            throw new Error(`participant with email ${participantBEmail} does not exist`)
        }
        let participantBUpdatedChatIds = []
        if (participantB.chatIds) {
            participantBUpdatedChatIds = participantB.chatIds
        }
        participantBUpdatedChatIds.push(newChatId)
        participantA.chatIds.push(newChatId)
        const updateBChatIdRes = await fetch(`/api/volunteeraccounts/${participantBEmail}`, {
            method: "PATCH",
            body: JSON.stringify(participantB)
        })
        if (!updateBChatIdRes.ok) throw new Error(`Something went wrong updating the participants chatid list with email ${participantBEmail}`)
        const updateAChatIdRes = await fetch(`/api/volunteeraccounts/${participantA.email}`, {
            method: "PATCH",
            body: JSON.stringify(participantA)
        }) 
        if (!updateAChatIdRes.ok) throw new Error(`Something went wrong updating the participants chatid list with email ${participantA.email}`)
        return {success: true, chat: resJson.data, otherUser: participantB}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, data: e}
    }
}

export const sendMessage = async(senderEmail: string, receiverEmail: string, messageString: string, chatId: string) => {
    try {
        const res = await fetch(`/api/chat/${chatId}`, {
            method: "GET"
        })
        if (!res) throw new Error("Internal Server Error")
        const resJson = await res.json()
        if (!res.ok) {
            throw new Error(resJson.data)
        }
        const newMessage: Message = {
            senderEmail,
            receiverEmail,
            messageString,
            sentTime: new Date().toLocaleString(),
            id: genUniqueId(),
            read: false,
        }
        const newMessageList = [...resJson.data.messages, newMessage]
        const editRes = await fetch(`/api/chat/${chatId}`, {
            method: "PATCH",
            body: JSON.stringify({messages: newMessageList, updatedAt: Date.now(), seenByParticipantA: senderEmail === resJson.data.participantAEmail ? true : false, seenByParticipantB: senderEmail === resJson.data.participantBEMail ? true : false})
        })
        console.log("setting seenbyparticipantA to ", senderEmail === resJson.data.participantAEmail)
        console.log("setting seenbyparticipantB to ", senderEmail === resJson.data.participantBEmail)
        if (!editRes) throw new Error("Internal Server Error")
        const editResJson = await editRes.json()
        if (!editRes.ok) throw new Error(editResJson.data)
        return {success: true, data: editResJson.data.messages as Message[]}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, error: e}
    }
}

export const isChatUpdated = async(chatId: string, length: number) => {
    try {   
        const res = await fetch(`/api/chat/isUpdated/${chatId}?length=${length}`, {
            method: "GET",
        })
        if (res.status === 204) return {modified: false}
        const resJson = await res.json()
        if (res.status === 500) return {error: resJson.error}
        else {
            // console.log("returning the messages:")
            // console.log("Messages: ", resJson.messages)
        return {modified: true, messages: resJson.messages as Message[], updatedAt: resJson.updatedAt as Date, seenByParticipantA: resJson.seenByParticipantA, seenByParticipantB: resJson.seenByParticipantB}
        }
    } catch (e: Error | any) {
        console.error(e)
        return {error: e}
    }
}

export async function generateChatInfo(account: VolunteerAccount): Promise<{ otherUser: VolunteerAccount, chat: Chat }[] | Error> {
    const ChatModel: mongoose.Model<Chat> = getChatModel()
    const VolunteerAccountModel: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    // console.log(account.chatIds)
    const promises = account.chatIds.map(async (chatId) => {
        const chat = await ChatModel.findOne({ id: chatId }) as Chat
        if (!chat) throw new Error(`chat with id ${chatId} not found`)
        const otherUserEmail = chat!.participantAEmail === account.email ? chat!.participantBEmail : chat!.participantAEmail
        const otherUser = await VolunteerAccountModel.findOne({ email: otherUserEmail }) as VolunteerAccount
        if (!otherUser) throw new Error(`user with email ${otherUserEmail} not found`)
        // console.log("returning this chat", chat)
        return { otherUser: otherUser, chat: chat }
    })
    const unsortedChats = await Promise.all(promises)
    return unsortedChats.sort((a, b) => b.chat.updatedAt.getTime() - a.chat.updatedAt.getTime())
}

export default createChat