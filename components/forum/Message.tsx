import { Message } from "../../models/Chat"
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import isSameDay from "date-fns/isSameDay";

const MessageComponent: React.FC<{ message: Message, isCurrUserMessage: boolean, otherUserName: string }> = ({ message, isCurrUserMessage, otherUserName }) => {
    // const userIcon = <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <g id="Group 75">
    //         <circle id="Ellipse 10" cx="25" cy="25" r="25" fill="#FE9835" />
    //         <ellipse id="Ellipse 11" cx="25" cy="16" rx="7.858" ry="7.112" fill="white" />
    //         <path id="Ellipse 12" d="M36.0896 32.2832C36.0896 35.9743 30.7314 35.5332 25 35.5332C19.2686 35.5332 13.9104 35.9743 13.9104 32.2832C13.9104 28.5921 19.2686 25.55 25 25.55C30.7314 25.55 36.0896 28.5921 36.0896 32.2832Z" fill="white" />
    //     </g>
    // </svg>
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
    const userIcon = (
        <svg width="37.5" height="37.5" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Group 75">
                <circle id="Ellipse 10" cx="25" cy="25" r="25" fill="#FE9835" />
                <ellipse id="Ellipse 11" cx="25" cy="16" rx="7.858" ry="7.112" fill="white" />
                <path
                    id="Ellipse 12"
                    d="M36.0896 32.2832C36.0896 35.9743 30.7314 35.5332 25 35.5332C19.2686 35.5332 13.9104 35.9743 13.9104 32.2832C13.9104 28.5921 19.2686 25.55 25 25.55C30.7314 25.55 36.0896 28.5921 36.0896 32.2832Z"
                    fill="white"
                />
            </g>
        </svg>
    );

    let date = formatDate(message.sentTime)
    let showFullDate = false
    if (date.substring(date.length - 8) === "days ago") {
        showFullDate = true
        date = message.sentTime.substring(0, 10)
        if (date.substring(date.length - 1) === ',') date = date.substring(0, 9)
    }
    return (

        <div style={{
            display: "flex", flexDirection: "row", alignItems: "start", width: "100%", height: "wrap-content", backgroundColor: "#5F5F5F", paddingTop: "10px", padding: "1px", cursor: "pointer", marginBottom: "5px",
        }}>
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
                {userIcon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start", width: "100%" }}>
                <h3 style={{ color: "white" }}>
                    {isCurrUserMessage ? "You" : otherUserName}
                </h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "start", marginRight: "3px", width: "100%" }}>
                    <p style={{ textAlign: "left", color: "white", fontSize: 13, width: "wrap-content", height: "wrap-content", maxWidth: 200, flexWrap: "wrap", whiteSpace: "normal", wordWrap: "break-word", hyphens: "auto" }}>
                        {message.messageString}
                    </p>
                    <p style={{ textAlign: "right", color: "white", fontSize: 6, maxWidth: 50 }}>
                        {showFullDate && message.sentTime}
                        {!showFullDate && date}
                    </p>
                </div>

            </div>
        </div>
    )
}
export default MessageComponent