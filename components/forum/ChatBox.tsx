import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { sendMessage } from "../../db_functions/chat";
import MessageComponent from './Message'
import { Message } from "../../models/Chat";

const ChatBox: React.FC<{
    user: VolunteerAccount, otherUser: VolunteerAccount, chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], setCurrChatInfo: Dispatch<SetStateAction<{
        otherUser: VolunteerAccount;
        chat: Chat;
    }[]>>, chatIndex: number
}> = ({ user, otherUser, chatInfo, chatIndex, setCurrChatInfo }) => {
    const [currMessage, setCurrMessage] = useState("")

    const createMessage = async () => {
        const { data, error, success } = await sendMessage(user.email, otherUser.email, currMessage, chatInfo[chatIndex].chat.id)
        if (!success) {
            alert("something went wrong")
            console.error(error)
            return
        } else if (!data) console.log("where is the data")
        if (data) {
            chatInfo[chatIndex].chat.messages = data
            setCurrChatInfo(chatInfo => [...chatInfo])
        }
        setCurrMessage("")
    }

    return (
        <>
            <h1>{`Conversation with ${otherUser.fname} ${otherUser.lname[0]}`}</h1>
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