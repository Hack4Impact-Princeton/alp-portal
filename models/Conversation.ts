import mongoose, {Types, Schema, Collection} from "mongoose";
import type { ChatMessageParams, Participant, TypingUsersList } from "@chatscope/use-chat";
import { ConversationParams, MessageContentType as MessageType,  MessageStatus, MessageDirection, MessageContent} from "@chatscope/use-chat";
import type { ChatMessage } from "@chatscope/use-chat";


// update this to match the Conversation type that actually exists in the
// useChat library.


// export interface Convo<ConversationData, MessageContentType> extends ConversationParams<ConversationData> {
//     id: string,
//     unreadCounter: number,
//     typingUsers: TypingUsersList
//     draft: string,
//     readonly: boolean,
//     data: ConversationData,
//     description: string,
//     participants: Types.Array<Participant>,
//     messages: Types.Array<Message<MessageContentType>>
// }
// const ConversationSchema = new Schema<Convo<ConversationData, MessageContentType>>({
//     id: {type: String, required: true},
//     unreadCounter: {type: Number},
//     typingusers: {type: TypingUsersList},
//     participants: [String],
//     messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]

// },
//     { collection: "conversations"}
// )

export interface ExtendedConversationParams<ConversationData, MessageContentType extends MessageType> extends ConversationParams<ConversationData> {
    messages: Array<ChatMessage<MessageContentType>>;
  }
export interface ExtendedConversationParamsDocument<ConversationData, MessageContentType extends MessageType> extends ExtendedConversationParams<ConversationData, MessageContentType>, Document {}

const MessageSchema = new Schema<ChatMessage<MessageType>>({
  id: { type: String, required: true },
  status: { type: Number, enum: Object.values(MessageStatus) },
  contentType: { type: Number, enum: Object.values(MessageType) },
  senderId: { type: String, required: true },
  direction: { type: String, enum: Object.values(MessageDirection) },
  content: Schema.Types.Mixed,
  createdTime: Date,
  updatedTime: Date,
});

const ExtendedConversationParamsSchema = new Schema<ExtendedConversationParamsDocument<any, any>>({
    id: { type: String, required: true },
    participants: { type: Array, required: false },
    unreadCounter: { type: Number, required: false },
    typingUsers: { type: Array, required: false },
    draft: { type: String, required: false }, 
    description: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    data: { type: Schema.Types.Mixed, required: false },
    messages: {type: [MessageSchema], required: false}
  },
    {collection: 'conversations'}
  );

function getExtendedConversationParamsModel() {
    if ("ExtendedConversationParams" in mongoose.models) return mongoose.models.ExtendedConversationParams;
    return mongoose.model("ExtendedConversationParams", ExtendedConversationParamsSchema)
}
export default getExtendedConversationParamsModel