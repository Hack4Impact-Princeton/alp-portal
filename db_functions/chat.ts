import { Message } from '../models/Chat'
import genUniqueId from '../lib/idGen'

const createChat = async(participantAEmail: string, participantBEmail: string)  => {
    try {
        const body = {
            participantAEmail,
            participantBEmail,
            id: genUniqueId(),
            messages: []
        }
        const res = await fetch(`/api/chat/${body.id}`, {
            method: "POST",
            body: JSON.stringify(body)
        })
        if (!res) throw new Error("Internal Server Error")
        const resJson = await res.json()
        if (!res.ok) throw new Error(`Something went wrong creating a chat between ${participantAEmail} and ${participantBEmail}`)
        return {success: true, data: resJson.data}
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
            body: JSON.stringify({messages: newMessageList})
        })
        if (!editRes) throw new Error("Internal Server Error")
        const editResJson = await editRes.json()
        if (!editRes.ok) throw new Error(editResJson.data)
        return {success: true, data: editResJson.data}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, error: e}
    }
}

export default createChat
