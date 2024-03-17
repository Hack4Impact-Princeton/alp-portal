import createChat, { isChatUpdated, checkNewChatInfos } from "../../db_functions/chat";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import ChatBox from "./ChatBox";
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import DownCaret from "../DownCaret";
import UpCaret from "../UpCaret";
import ChatPreview from "./ChatPreview";
const ChatList: React.FC<{ chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], user: VolunteerAccount, showChat: boolean, setShowChat: Dispatch<SetStateAction<boolean>> }> = ({ chatInfo, user, showChat, setShowChat }) => {
    const [currChatInfo, setCurrChatInfo] = useState(chatInfo)
    const [currChatAndOtherUser, setCurrChatAndOtherUser] = useState<{ otherUser: VolunteerAccount, chat: Chat } | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const { error, newChatInfos } = await checkNewChatInfos(user.email, currChatInfo.length)
            if (error) console.error("ERROR", error)
            else if (newChatInfos) {
                console.log("newChatInfos", newChatInfos)
                let done = false
                if (!done) {
                    setCurrChatInfo(oldChatInfo => [...newChatInfos, ...oldChatInfo])
                }
                done = true
            } else {
                console.log("I don't see anything lol")
            }
            currChatInfo.map(async ({ chat, otherUser }, index) => {
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
            console.log("checking for a chat update")
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
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
        for (let i = 0; i < currChatInfo.length; i++) {
            if (currChatInfo[i].chat.id === chatObj.chat.id) return i;
        }
        return -1
    }
    return (
        <div style={{ display: "flex", alignItems: "flex-end", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            {currChatAndOtherUser &&
                <div style={{ maxHeight: 500, width: 350, height: "wrap-content", backgroundColor: "#5F5F5F", marginRight: 30, borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}>
                    <ChatBox setCurrChatAndOtherUser={setCurrChatAndOtherUser}
                        otherUser={currChatAndOtherUser.otherUser}
                        chatIndex={findChatIndex(currChatAndOtherUser)}
                        chatInfo={currChatInfo} user={user}
                        setCurrChatInfo={setCurrChatInfo} />
                </div>
            }
            <div style={{ maxHeight: 500, height: "wrap-content", borderRadius: "25px" }}>
                <div style={{ width: "100%", display: "flex", justifySelf: "flex-end", alignSelf: "start", justifyContent: "space-between", paddingLeft: "15px", borderBottom: "3px solid white", paddingTop: "1px", backgroundColor: "#5F5F5F", borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }} onClick={() => setShowChat(showChat => !showChat)}>
                    <h3 style={{ color: "white", marginTop: "12px" }}>
                        Messages
                    </h3>
                    {!showChat &&
                        <UpCaret bgColor="#FFFFFF" onClick={() => setShowChat(true)} />}
                    {showChat &&
                        <DownCaret bgColor="#FFFFFF" onClick={() => setShowChat(false)} />}
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#5F5F5F",
                    width: 345,
                    height: "fit-content",
                    maxHeight: '500px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none', // For Firefox
                    WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
                    msOverflowStyle: 'none', // For IE 10+
                    paddingTop: "5px",
                }}>
                    {showChat &&
                        currChatInfo.map(({ chat, otherUser }, index) =>
                            <ChatPreview chat={chat} otherUser={otherUser} chatInfo={currChatInfo}
                                chatIndex={index} user={user} key={chat.id} createChatByEmail={createChatByEmail}
                                setCurrChatAndOtherUser={setCurrChatAndOtherUser} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default ChatList