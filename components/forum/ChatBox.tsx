import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import { useState, Dispatch, SetStateAction, useRef } from 'react'
import { sendMessage } from "../../db_functions/chat";
import MessageComponent from './Message'
import { TextareaAutosize } from "@mui/material";
import SendIcon from '@mui/icons-material/Send'
import CircularIcon from "../CircularIcon";
import formatDistance from "date-fns/formatDistance";
import format from "date-fns/format";
const ChatBox: React.FC<{
    user: VolunteerAccount, otherUser: VolunteerAccount, chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], setCurrChatInfo: Dispatch<SetStateAction<{
        otherUser: VolunteerAccount;
        chat: Chat;
    }[]>>, chatIndex: number, setCurrChatAndOtherUser: Dispatch<SetStateAction<{ otherUser: VolunteerAccount, chat: Chat } | null>>
}> = ({ user, otherUser, chatInfo, chatIndex, setCurrChatInfo, setCurrChatAndOtherUser }) => {
    const [currMessage, setCurrMessage] = useState("")
    const enterKeyRef = useRef<HTMLDivElement | null>(null)
    const messageContainerRef = useRef<HTMLDivElement | null>(null)
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
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
        }
    }


    // TODO make it so that when the tab key is pressed, it focuses on the sendIcon
    const handleEnterKeyPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && currMessage.trim() !== "") {
            createMessage()
        } else if (e.key === "Tab" && enterKeyRef.current) {
            enterKeyRef.current.focus()
            console.log("current element", document.activeElement)
        }
    }

    const svgX = <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>

    // TODO fix the rounding
    return (
        <div style={{ height: "wrap-content", display: "flex", flexDirection: "column", maxHeight: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", padding: 6, height: "43px", borderBottom: "3px solid white", backgroundColor: "#5F5F5F", borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}>
                <h1 style={{ color: "white", fontSize: "20px", marginLeft: "5px" }}>{`${otherUser.fname} ${otherUser.lname[0]}`}</h1>
                <CircularIcon bgColor="#5F5F5F" reactNodeContent={svgX} onClick={() => setCurrChatAndOtherUser(null)} />
            </div>
            <div ref={messageContainerRef}
                style={{ display: "flex", flexDirection: "column", alignSelf: "center", alignItems: "center", width: "100%", paddingRight: 7, paddingLeft: 7, paddingTop: 20, paddingBottom: 10, borderRadius: "5%", overflowY: "auto", height: "fit-content", cursor: "default" }}>

                {chatInfo[chatIndex].chat.messages && chatInfo[chatIndex].chat.messages.map(message =>
                    <MessageComponent message={message} isCurrUserMessage={user.email === message.senderEmail} key={message.id} otherUserName={`${otherUser.fname} ${otherUser.lname[0]}`} />
                )}
            </div>
            <form onSubmit={createMessage} >
                <div style={{ display: "flex", flexDirection: "column", padding: 15 }}>
                    <TextareaAutosize maxRows={8} minRows={1} cols={35}
                        onKeyDown={handleEnterKeyPressed}
                        value={currMessage}
                        placeholder="Type your message here..."
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrMessage(e.target.value)}
                        style={{
                            width: "100%",
                            marginRight: "2rem",
                            marginLeft: "0rem",
                            borderRadius: "4px",
                            paddingRight: "3rem",
                            paddingLeft: "1rem",
                            minHeight: "3rem",
                            maxHeight: "7rem",
                            outline: "none",
                            border: "2px solid #EEEEEE",
                            resize: "none",
                            overflowY: "auto"
                        }}
                    />
                    <div
                        ref={enterKeyRef}
                        style={{
                            //move it to be inside the right of the input
                            position: "absolute",
                            right: "25.2rem",
                            bottom: "1.4rem",
                            //color: "#F5F5F5",
                            color: "white",
                            backgroundColor: "#F3D39A", // ^^
                            borderRadius: "50%",
                            padding: "0.2rem",
                            width: "1.5em",
                            height: "1.5rem",
                            textAlign: "center",
                            verticalAlign: "middle",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                        onClick={createMessage}
                    >
                        <SendIcon
                            style={{
                                fontSize: "1rem",
                                marginLeft: "0.1rem",
                            }}
                        />
                    </div>
                    {/* <TextareaAutosize maxRows={8} minRows={1} cols={35} style={{ resize: "none" }} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrMessage(e.target.value)} value={currMessage} placeholder={"Type your message here"} /> */}
                    {/* <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrMessage(e.target.value)} value={currMessage} placeholder={"Type your message here"} /> */}
                    {/* <button onClick={createMessage}>Send</button> */}
                </div>
            </form>
        </div>
    )
}
export default ChatBox