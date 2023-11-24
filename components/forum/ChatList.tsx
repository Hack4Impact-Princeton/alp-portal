import { CurrencyExchangeOutlined } from "@mui/icons-material";
import createChat, { isChatUpdated } from "../../db_functions/chat";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import ChatBox from "./ChatBox";
import { useEffect, useState } from 'react'
import { Message } from "../../models/Chat";
import ChatPreview from "./ChatPreview";
import DownCaret from "../DownCaret";
const ChatList: React.FC<{ chatInfo: { otherUser: VolunteerAccount, chat: Chat }[], user: VolunteerAccount }> = ({ chatInfo, user }) => {

    const [currChatInfo, setCurrChatInfo] = useState(chatInfo)
    const [currChatAndOtherUser, setCurrChatAndOtherUser] = useState<{ otherUser: VolunteerAccount, chat: Chat } | null>(null)
    // const [updatedChats, setUpdatedChats] = useState(chatInfo.map(({chat}) => {
    //     if (chat.participantAEmail === user.email && chat.seenByParticipantA) return false
    //     if (chat.participantBEmail === user.email && chat.seenByParticipantB) return false
    //     return true
    // }))
    // console.log("currchatinfo", ...currChatInfo)
    useEffect(() => {
        const fetchData = async () => {
            currChatInfo.map(async ({ chat, otherUser }, index) => {
                const res = await isChatUpdated(chat.id, chat.messages.length)
                if (res.error) console.error(res.error)
                else if (res.modified === true && res.messages) {
                    console.log("someone cooked here")
                    // TODO see if you can simplify this a little
                    // maybe you can just pass the whole chat instead of little bits of it
                    const modifiedChat = chat
                    modifiedChat.messages = res.messages
                    modifiedChat.updatedAt = res.updatedAt
                    modifiedChat.seenByParticipantA = res.seenByParticipantA
                    modifiedChat.seenByParticipantB = res.seenByParticipantB
                    if (currChatAndOtherUser?.chat.id === modifiedChat.id) {
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

                    }
                    const modifiedChatInfo = currChatInfo
                    modifiedChatInfo[index].chat = modifiedChat
                    // updatedChats[index] = true
                    const updatedChatAndUser = modifiedChatInfo.splice(index, 1)[0]
                    modifiedChatInfo.unshift(updatedChatAndUser)
                    // const updatedChatUpdate = updatedChats.splice(index, 1)[0]
                    // const updatedChatUpdateArray = [updatedChatUpdate, ...updatedChats]
                    // setUpdatedChats(updatedChatUpdateArray)
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
                        alert("updating the chat to show that participant A saw it didn't work")
                        return
                    } else {
                        console.log(await res.json())
                    }
                    console.log("success")
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
                        alert("updating the chat to show that participant A saw it didn't work")
                        return
                    } else {
                        console.log(await res.json())
                    }
                    console.log("success")
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
        // TODO use binary search by lastUpdatedBy field
        for (let i = 0; i < currChatInfo.length; i++) {
            if (currChatInfo[i].chat.id === chatObj.chat.id) {
                console.log("returning", i)
                return i
            }
        }
        console.log("returning -1")
        return -1
    }

    const divStyle = {
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
        '&::-webkit-scrollbar': {
            display: "none"
        },
        marginBottom: "10px",
        paddingTop: "5px"
    } as React.CSSProperties
    return (
        <>
            <div style={divStyle}>
                {/* <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "15px", paddingTop: "1px" }}>
                    <h3 style={{ color: "white", marginTop: "12px" }}>
                        Messages
                    </h3>
                    <DownCaret bgColor="#FFFFFF" onClick={() => console.log("hi")} />
                </div> */}
                {currChatAndOtherUser &&
                    <ChatBox setCurrChatAndOtherUser={setCurrChatAndOtherUser} otherUser={currChatAndOtherUser.otherUser} chatIndex={findChatIndex(currChatAndOtherUser)} chatInfo={currChatInfo} user={user} setCurrChatInfo={setCurrChatInfo} />
                }
                {!currChatAndOtherUser && currChatInfo.map(({ chat, otherUser }, index) =>
                    <ChatPreview chat={chat} otherUser={otherUser} chatInfo={currChatInfo} chatIndex={index} user={user} key={chat.id} createChatByEmail={createChatByEmail} setCurrChatAndOtherUser={setCurrChatAndOtherUser} />
                )}
            </div>
        </>
    )
}
export default ChatList