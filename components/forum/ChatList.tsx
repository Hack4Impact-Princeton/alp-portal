import createChat, { isChatUpdated } from "../../db_functions/chat";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import ChatBox from "./ChatBox";
import { useEffect, useState } from 'react'
import ChatPreview from "./ChatPreview";
const ChatList: React.FC<{ chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], user: VolunteerAccount }> = ({ chatInfo, user }) => {

    const [currChatInfo, setCurrChatInfo] = useState(chatInfo)
    const [currChatAndOtherUser, setCurrChatAndOtherUser] = useState<{ otherUser: VolunteerAccount, chat: Chat } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            currChatInfo.map(async ({ chat }, index) => {
                const res = await isChatUpdated(chat.id, chat.messages.length)
                if (res.error) console.error(res.error)
                else if (res.modified === true && res.chat) {
                    const modifiedChat = res.chat
                    // if the currently open chat updates, should be marked as read for user
                    if (currChatAndOtherUser && currChatAndOtherUser.chat.id === modifiedChat.id) {
                        if (user.email === currChatAndOtherUser.chat.participantAEmail) {
                            await fetch(`/api/chat/${chat.id}`, {
                                method: "PATCH",
                                body: JSON.stringify({ seenByParticipantA: true })
                            })
                            modifiedChat.seenByParticipantA = true
                        }
                        else {
                            await fetch(`/api/chat/${chat.id}`, {
                                method: "PATCH",
                                body: JSON.stringify({ seenByParticipantB: true })
                            })
                            modifiedChat.seenByParticipantB = true
                        }
                        setCurrChatAndOtherUser({ otherUser, chat: modifiedChat })
                    }
                    currChatInfo[index].chat = modifiedChat
                    currChatInfo.unshift(currChatInfo.splice(index, 1)[0])
                    setCurrChatInfo(modifiedChatInfo => [...modifiedChatInfo])
                }
            })
            console.log("fetching data")
        };
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    })

    useEffect(() => {
        // if currChatAndOtherUser changs to a non-null value, this means
        // that a chat was opened so that chat's seenBy values should change
        const updateRead = async () => {
            if (currChatAndOtherUser) {
                const index = findChatIndex(currChatAndOtherUser)
                const chat = currChatInfo[index].chat
                if (user.email === chat.participantAEmail && !chat.seenByParticipantA) {
                    // update currChatInfo 
                    chat.seenByParticipantA = true
                    setCurrChatInfo(prev => [...prev])
                    // make API call
                    const res = await fetch(`/api/chat/${chat.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ seenByParticipantA: true })
                    })
                    if (!res.ok) {
                        console.error("updating the chat to show that participant A saw it didn't work")
                        return
                    }
                    setCurrChatAndOtherUser({ otherUser: currChatAndOtherUser.otherUser, chat })
                } else if (user.email === chat.participantBEmail && !chat.seenByParticipantB) {
                    // update currChatInfo 
                    chat.seenByParticipantB = true
                    setCurrChatInfo(prev => [...prev])

                    // make API call
                    const res = await fetch(`/api/chat/${chat.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ seenByParticipantB: true })
                    })
                    if (!res.ok) {
                        console.error("updating the chat to show that participant A saw it didn't work")
                        return
                    }
                    setCurrChatAndOtherUser({ otherUser: currChatAndOtherUser.otherUser, chat })
                }
            }
        }
        updateRead()
    }, [currChatAndOtherUser])

    const createChatByEmail = async (email: string) => {
        const { chat, otherUser, success, data } = await createChat(email, user)
        console.log("creating new chat")
        if (!success) {
            alert(data)
            return
        } else {
            setCurrChatInfo(prevChatInfo => [{ otherUser, chat }, ...prevChatInfo])
            setCurrChatAndOtherUser(chatInfo[0])
        }
    }
    const findChatIndex = (chatObj: { otherUser: VolunteerAccount, chat: Chat }) => {
        let lo = 0
        let hi = currChatInfo.length - 1
        while (lo <= hi) {
            let mid = (lo + hi) >> 1
            console.log(mid)
            if (currChatInfo[mid].chat.id === chatObj.chat.id) return mid
            if (new Date(currChatInfo[mid].chat.updatedAt).getTime() < new Date(chatObj.chat.updatedAt).getTime()) {
                hi = mid - 1
            } else lo = mid + 1
        }
        return -1
    }
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#5F5F5F",
                width: "98.5%",
                height: "fit-content",
                maxHeight: '500px',
                overflowY: 'auto',
                scrollbarWidth: 'none', // For Firefox
                WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
                msOverflowStyle: 'none', // For IE 10+
                marginBottom: "10px",
                paddingTop: "5px"
            }}>
                {currChatAndOtherUser &&
                    <ChatBox setCurrChatAndOtherUser={setCurrChatAndOtherUser}
                        otherUser={currChatAndOtherUser.otherUser}
                        chatIndex={findChatIndex(currChatAndOtherUser)}
                        chatInfo={currChatInfo} user={user}
                        setCurrChatInfo={setCurrChatInfo} />
                }
                {!currChatAndOtherUser && currChatInfo.map(({ chat, otherUser }, index) =>
                    <ChatPreview chat={chat} otherUser={otherUser} chatInfo={currChatInfo}
                        chatIndex={index} user={user} key={chat.id} createChatByEmail={createChatByEmail}
                        setCurrChatAndOtherUser={setCurrChatAndOtherUser} />
                )}
            </div>
        </>
    )
}
export default ChatList