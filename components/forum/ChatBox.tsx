import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { useState, Dispatch, SetStateAction } from 'react'
import { sendMessage } from "../../db_functions/chat";
import MessageComponent from './Message'

const ChatBox: React.FC<{
    user: VolunteerAccount, otherUser: VolunteerAccount, chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], setCurrChatInfo: Dispatch<SetStateAction<{
        otherUser: VolunteerAccount;
        chat: Chat;
    }[]>>, chatIndex: number, setCurrChatAndOtherUser: Dispatch<SetStateAction<{ otherUser: VolunteerAccount, chat: Chat } | null>>
}> = ({ user, otherUser, chatInfo, chatIndex, setCurrChatInfo, setCurrChatAndOtherUser }) => {
    const [currMessage, setCurrMessage] = useState("")

    const createMessage = async () => {
        const { messages, updatedAt, seenByParticipantA, seenByParticipantB, error, success } = await sendMessage(user.email, otherUser.email, currMessage, chatInfo[chatIndex].chat.id)
        if (!success) {
            alert("something went wrong")
            console.error(error)
            return
        } else if (!messages) console.log("where is the data")
        if (messages) {
            // update currChatInfo array and currChatAndOtherUser to reflect that 
            // a message has been send and the chat has been updated
            const chat = chatInfo[chatIndex].chat
            chat.messages = messages
            chat.updatedAt = updatedAt
            chat.seenByParticipantA = seenByParticipantA
            chat.seenByParticipantB = seenByParticipantB
            setCurrChatAndOtherUser({ otherUser, chat })
            const updatedChat = chatInfo.splice(chatIndex, 1)[0]
            chatInfo.unshift(updatedChat)
            setCurrChatInfo(chatInfo => [...chatInfo])
        }
        setCurrMessage("")
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <p onClick={() => setCurrChatAndOtherUser(null)}>Back</p>
                <h1>{`${otherUser.fname} ${otherUser.lname[0]}`}</h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "90%", padding: 15, height: "80%", border: "1.5px solid black", borderRadius: "5%" }}>
                {chatInfo[chatIndex].chat.messages && chatInfo[chatIndex].chat.messages.map(message =>
                    <MessageComponent message={message} isCurrUserMessage={user.email === message.senderEmail} key={message.id} />
                )}
            </div>
            <div style={{ width: "90%", padding: 15, height: 25 }}>
                <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrMessage(e.target.value)} value={currMessage} placeholder={"Type your message here"} />
            </div>
            <button onClick={createMessage}>Click to send message</button>
        </>
    )
}
export default ChatBox