import { Dispatch, SetStateAction, useState } from "react";
import { Chat } from "../../models/Chat";
import { VolunteerAccount } from "../../models/VolunteerAccount";
import CircularIcon from "../CircularIcon";
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const ChatPreview: React.FC<{ chat: Chat, user: VolunteerAccount, otherUser: VolunteerAccount, createChatByEmail: (email: string) => void, setCurrChatAndOtherUser: Dispatch<SetStateAction<{ otherUser: VolunteerAccount; chat: Chat } | null>>, chatIndex: number, chatInfo: { otherUser: VolunteerAccount, chat: Chat }[] }> = ({ chatIndex, chatInfo, user, otherUser, setCurrChatAndOtherUser }) => {
    const [chatHovered, setChatHovered] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteChat = () => {
    // derek cook
    console.log("Deleting chat...");
    setShowDeleteModal(false);
    };
    let lastMessage = null
    let lastMessageString = ""
    const chat = chatInfo[chatIndex].chat
    if (chat.messages.length !== 0) {
        lastMessage = chat.messages[chat.messages.length - 1]
        lastMessageString = lastMessage.messageString
    }
    if (lastMessageString.length > 25) {
        lastMessageString = lastMessageString.substring(0, 21)
        lastMessageString += "..."
    }
    const userIcon = <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 75">
            <circle id="Ellipse 10" cx="25" cy="25" r="25" fill="#FE9835" />
            <ellipse id="Ellipse 11" cx="25" cy="16" rx="7.858" ry="7.112" fill="white" />
            <path id="Ellipse 12" d="M36.0896 32.2832C36.0896 35.9743 30.7314 35.5332 25 35.5332C19.2686 35.5332 13.9104 35.9743 13.9104 32.2832C13.9104 28.5921 19.2686 25.55 25 25.55C30.7314 25.55 36.0896 28.5921 36.0896 32.2832Z" fill="white" />
        </g>
    </svg>
    const formatDate = (d: string) => {
        const NATURAL_FORMATTING_DISTANCE = 30 * 6; // 6 months
        const date = Date.parse(d);

        const diff = Math.floor(
            (new Date().getTime() - date) / (24 * 60 * 60 * 1000)
        );

        if (diff <= NATURAL_FORMATTING_DISTANCE) {
            return formatDistance(date, new Date(), { addSuffix: true });
        } else {
            return format(date, "MMMM do, yyyy");
        }
    };

    let date = lastMessage ? formatDate(lastMessage.sentTime) : "Click here to get the conversation going"
    let showFullDate = false
    if (date.substring(date.length - 8) === "days ago") {
        showFullDate = true
        date = lastMessage!.sentTime.substring(0, 10)
        if (date.substring(date.length - 1) === ',') date = date.substring(0, 9)
    }

    return (
        <div onClick={() => setCurrChatAndOtherUser(chatInfo[chatIndex])} onMouseEnter={() => setChatHovered(true)} onMouseLeave={() => setChatHovered(false)} style={{
            display: "flex", flexDirection: "row", alignItems: "center", width: "100%", height: "65px", backgroundColor: chatHovered ? "#444444" : "#5F5F5F", paddingTop: "10px", padding: "5px", cursor: "pointer",
        }}>
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
                {userIcon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start", width: "100%" }}>
                <h3 style={{ color: "white" }}>
                    {`${otherUser.fname} ${otherUser.lname[0]}.`}
                </h3>
                {lastMessage && <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: "3px", width: "170px" }}>
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
                     <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", padding: "20px", maxWidth: "320px" }}>
        <h2 style={{ color: "#333333", marginBottom: "20px", textAlign: "center" }}>{`Are you sure you want to delete chat with ${otherUser.fname} ${otherUser.lname}?`}</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="error" onClick={handleDeleteChat} sx={{ marginRight: "10px" }}>Yes</Button>
            <Button variant="contained" onClick={() => setShowDeleteModal(false)}>No</Button>
        </div>
    </div>
</Modal>

            {lastMessage &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%", width: "100%", alignSelf: "start", marginTop: "10px" }}>

                    <p style={{ textAlign: "right", color: "white", paddingRight: "10px", fontSize: 8, marginBottom: "5px" }}>
                        {date}
                    </p>
                              <button
                onClick={() => setShowDeleteModal(true)}
                style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", marginTop: "5px", color: "red", marginLeft: "65px" }}
            >
                X
            </button>
                    {(chat.participantAEmail === user.email ? (!chat.seenByParticipantA && lastMessage) : (!chat.seenByParticipantB && lastMessage)) &&
                        <div style={{ display: "flex", marginLeft: "auto", marginRight: "9px", marginTop: "2px" }}>
                            <CircularIcon diameter={"12"} bgColor="#FE9835" />
                        </div>
                    }
                </div>}
        </div>
    )
}

export default ChatPreview