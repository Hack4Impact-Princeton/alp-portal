import mongoose from "mongoose"
const {Schema} = mongoose

export interface Message {
    id: string, // unique message id
    senderEmail: string, // email of the sender
    receiverEmail: string, // email of the receiver
    sentTime: string, // date and time sent
    read: boolean, // whether the message has been seen by receiver
    messageString: string // the actual message of the string 
} 

const MessageSchema = new Schema<Message>({
    id: {type: String, required: true},
    senderEmail: {type: String, required: true},
    receiverEmail: {type: String, required: true},
    sentTime: {type: String, required: true},
    read: {type: Boolean, required: true},
    messageString: {type: String, required: true},
    
},
{collection: 'messages'},
)

export const getMessageModel = () => {
    if ("Message" in mongoose.models) return mongoose.models.Message
    return mongoose.model("Message", MessageSchema)
}
export interface Chat {
    id: string, // unique id of the chat conversation
    participantAEmail: string, // email of participant A
    participantBEmail: string, // email of participant B
    messages: [typeof MessageSchema], // array of messages
}
const ChatSchema = new Schema<Chat>({
    id: {type: String, required: true},
    participantAEmail: {type: String, required: true},
    participantBEmail: {type: String, required: true},
    messages: {type: [MessageSchema], required: true}

})

const getChatModel = () => {
    if ("Chat" in mongoose.models) return mongoose.models.Chat
    return mongoose.model("Chat", ChatSchema)
}
export default getChatModel