import { Message } from "../../models/Chat"

const MessageComponent: React.FC<{ message: Message, isCurrUserMessage: boolean }> = ({ message, isCurrUserMessage }) => {
    return (
        <div style={{ width: "wrap-content", height: "wrap-content", padding: 5, border: "1.5px solid black", borderRadius: "35%", backgroundColor: isCurrUserMessage ? "#1F8AFF" : "d8d8d8", alignSelf: isCurrUserMessage ? "flex-end" : "flex-start" }}>
            <p style={{ fontSize: 20, fontWeight: 600 }}>{message.messageString}</p>
            <p style={{ fontSize: 8 }}>{message.sentTime}</p>
        </div>
    )
}
export default MessageComponent