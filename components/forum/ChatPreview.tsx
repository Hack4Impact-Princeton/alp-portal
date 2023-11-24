import { Dispatch, SetStateAction } from "react";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import CircularIcon from "../CircularIcon";

const ChatPreview: React.FC<{ chat: Chat, user: VolunteerAccount, otherUser: VolunteerAccount, updatedChats?: boolean[], setUpdatedChats?: Dispatch<SetStateAction<boolean[]>>, createChatByEmail: (email: string) => void, setCurrChatAndOtherUser: Dispatch<SetStateAction<{ otherUser: VolunteerAccount; chat: Chat } | null>>, chatIndex: number, chatInfo: { otherUser: VolunteerAccount, chat: Chat }[] }> = ({ chatIndex, chatInfo, user, otherUser, setCurrChatAndOtherUser }) => {
    let lastMessage = null
    let lastMessageString = ""
    const chat = chatInfo[chatIndex].chat
    if (chat.messages.length !== 0) {
        lastMessage = chat.messages[chat.messages.length - 1]
        lastMessageString = lastMessage.messageString
    }
    if (lastMessageString.length > 25) {
        lastMessageString = lastMessageString.substring(0, 24)
        lastMessageString += "..."
    }
    const userIcon = <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 75">
            <circle id="Ellipse 10" cx="25" cy="25" r="25" fill="#FE9835" />
            <ellipse id="Ellipse 11" cx="25" cy="16" rx="7.858" ry="7.112" fill="white" />
            <path id="Ellipse 12" d="M36.0896 32.2832C36.0896 35.9743 30.7314 35.5332 25 35.5332C19.2686 35.5332 13.9104 35.9743 13.9104 32.2832C13.9104 28.5921 19.2686 25.55 25 25.55C30.7314 25.55 36.0896 28.5921 36.0896 32.2832Z" fill="white" />
        </g>
    </svg>


    return (
        <div onClick={() => setCurrChatAndOtherUser(chatInfo[chatIndex])} style={{
            display: "flex", flexDirection: "row", alignItems: "center", width: "100%", height: "65px", backgroundColor: "#5F5F5F", paddingTop: "10px", padding: "5px", cursor: "pointer",
        }}>
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
                {userIcon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}>
                <h3 style={{ color: "white" }}>
                    {`${otherUser.fname} ${otherUser.lname[0]}.`}
                </h3>
                {lastMessage && <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: "3px" }}>
                    <p style={{ textAlign: "left", color: "white", paddingRight: "10px", fontSize: 13 }}>
                        {`${lastMessage.sentTime.substring(0, 10)}`}
                    </p>
                    <p style={{ textAlign: "left", color: "white", fontSize: 13 }}>
                        {lastMessageString}
                    </p>
                </div>}
                {!lastMessage &&
                    <div>
                        <p style={{ color: "white", fontSize: 13, display: "flex" }}>
                            Click here to get the conversation going
                        </p>
                    </div>
                }
            </div>
            {(chat.participantAEmail === user.email ? (!chat.seenByParticipantA && lastMessage) : (!chat.seenByParticipantB && lastMessage)) &&
                <div style={{ display: "flex", marginLeft: "auto", marginRight: "3px" }}>
                    <CircularIcon diameter={"12"} bgColor="#FE9835" />
                </div>
            }

        </div>
    )
}

export default ChatPreview