import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Broadcast {
    id: string, // id of the broadcast
    senderEmail: string, // email of sender
    senderName: string, // first name and last initial of sender
    receiverEmails: string[], // emails of receivers
    sentTime: string, // date and time
    read: boolean[], // the array that keeps track of who read the message
    subject: string, // subject of the broadcast
    message: string, // the actual message body
}
const BroadcastSchema = new Schema<Broadcast>({
    id: {type: String, required: true},
    senderName: {type: String, required: true},
    senderEmail: {type: String, required: true},
    receiverEmails: {type: [String], required: true},
    sentTime: {type: String, required: true},
    read: {type: [Boolean], required: true},
    subject: {type: String, required: true},
    message: {type: String, required: true},
}, 
{collection: 'broadcasts'},
)
const getBroadcastModel = () => {
    if ("Broadcast" in mongoose.models) return mongoose.models.Broadcast;
    return mongoose.model("Broadcast", BroadcastSchema);
  }
  export default getBroadcastModel;


