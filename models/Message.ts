
import mongoose, { Schema, SchemaTypeOptions} from "mongoose";
import { MessageContentType,  MessageStatus, MessageDirection, MessageContent} from "@chatscope/use-chat";
import type { ChatMessage } from "@chatscope/use-chat";
// export type ChatMessage<MessageContentType> = {
//     id: string;
//     // enum
//     status: MessageStatus;
//     // enum
//     contentType: MessageContentType;
//     senderId: string;
//     // 'incoming' or 'outgoing'
//     direction: MessageDirection;
//     content: MessageContent<MessageContentType>;
//     createdTime?: Date;
//     updatedTime?: Date;
// }

const MessageSchema = new Schema<ChatMessage<MessageContentType>>({
    id: { type: String, required: true },
    status: { type: Number, enum: Object.values(MessageStatus) },
    contentType: { type: Number, enum: Object.values(MessageContentType) },
    senderId: { type: String, required: true },
    direction: { type: String, enum: Object.values(MessageDirection) },
    content: Schema.Types.Mixed,
    createdTime: Date,
    updatedTime: Date,
  });
  
  export default mongoose.model<ChatMessage<MessageContentType>>("Message", MessageSchema);