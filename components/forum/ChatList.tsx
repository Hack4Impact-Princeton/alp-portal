import { CurrencyExchangeOutlined } from "@mui/icons-material";
import createChat, { isChatUpdated } from "../../db_functions/chat";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import ChatBox from "./ChatBox";
import { useEffect, useState } from 'react'
import { Message } from "../../models/Chat";
const ChatList: React.FC<{ chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], user: VolunteerAccount }> = ({ chatInfo, user }) => {
    const [currChatInfo, setCurrChatInfo] = useState(chatInfo)
    // console.log("currchatinfo", ...currChatInfo)
    useEffect(() => {
        const fetchData = async () => {
            currChatInfo.map(async ({ chat, otherUser }, index) => {
                const res = await isChatUpdated(chat.id, chat.messages.length)
                if (res.error) console.error(res.error)
                else if (res.modified === true && res.messages) {
                    console.log("someone cooked here")
                    const modifiedChat = chat
                    modifiedChat.messages = res.messages
                    const modifiedChatInfo = currChatInfo
                    modifiedChatInfo[index].chat = modifiedChat
                    setCurrChatInfo(modifiedChatInfo => [...modifiedChatInfo])
                }
            })
            console.log("fetching data")
        };

        fetchData();

        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    })

    const createChatByEmail = async (email: string) => {
        const { chat, otherUser, success } = await createChat(email, user)
        if (!success) {
            alert("something went wrong")
            return
        } else {
            const modifiedChatInfo = currChatInfo
            modifiedChatInfo.push({ otherUser, chat })
            setCurrChatInfo(modifiedChatInfo)
            console.log("chat", chat)
            console.log("otherUser", otherUser)
            alert("everything went to plan")
        }
    }
    return (
        <>
            <div style={{ border: "1.5px solid black", height: "wrap-content", width: "100%" }}>
                {/* <button onClick={createChatWithEmail}>Create chat with test7</button> */}
                {currChatInfo.map(({ chat, otherUser }, index) =>
                    <ChatBox chatInfo={chatInfo} chatIndex={index} user={user} otherUser={otherUser} key={chat.id} setCurrChatInfo={setCurrChatInfo} />)
                }
            </div>
        </>
    )
}
export default ChatList