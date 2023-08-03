import { Broadcast } from "../models/Broadcast"
import genUniqueId from "../lib/idGen"
const sendBroadcast = async(email: string, recipients: string[], subject: string, message: string) => {
    try {
        if (recipients.length == 0) throw new Error("Recipient list cannot be empty")
        if (subject === '') throw new Error("Subject cannot be empty")
        if (message === '') throw new Error("Message cannot be empty")
        const broadcast: Broadcast = {
            id: genUniqueId(),
            senderEmail: email,
            receiverEmails: recipients,
            read: new Array<boolean>(recipients.length).fill(false),
            subject: subject,
            message: message,
            sentTime: new Date().toString()
        }
        const res = await fetch(`/api/broadcast/${broadcast.id}`, {
            method: "POST",
            body: JSON.stringify(broadcast)
        })
        if (!res) throw new Error("Internal server error")
        const resJson = await res.json()
        if (res.status !== 200) throw new Error(resJson.data)
        console.log("successfully sent out the broadcast", resJson.data)
        return {success: true, broadcast: resJson.data}
    } catch (e: Error | any) {
        console.error('Error while sending email', e);
        return {success: false, error: e}
    }
}

export default sendBroadcast