import createChat, { isChatUpdated } from "../../db_functions/chat";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import ChatBox from "./ChatBox";
import { useEffect, useState } from 'react'
const ChatList: React.FC<{ chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], user: VolunteerAccount }> = ({ chatInfo, user }) => {
    const [currChatInfo, setCurrChatInfo] = useState(chatInfo)
    useEffect(() => {
        const fetchData = async () => {
            currChatInfo.map(async ({ chat }, index) => {
                const res = await isChatUpdated(chat.id, chat.messages.length)
                if (res.error) console.error(res.error)
                else if (res.modified === true && res.messages) {
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
            setCurrChatInfo(prevChatInfo => [...prevChatInfo, { otherUser, chat }])
        }
    }
    return (
        <>
            <div style={{ border: "1.5px solid black", height: "wrap-content", width: "100%" }}>
                {/* <button onClick={() => createChatByEmail("test9@test.com")}>Create chat with test9</button> */}
                {currChatInfo.map(({ chat, otherUser }, index) =>
                    <ChatBox chatInfo={currChatInfo} chatIndex={index} user={user} otherUser={otherUser} key={chat.id} setCurrChatInfo={setCurrChatInfo} />)
                }
            </div>
        </>
    )
}
export default ChatList