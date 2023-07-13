import { Grid, Box } from '@mui/material'
import { Broadcast } from '../models/Broadcast'
type BroadcastMessageProps = {
    broadcast: Broadcast,
    isRead?: boolean | undefined,
    onRead?: (broadcastId: string, isRead: boolean) => Promise<void>,
    isVolunteer: boolean
}
const BroadcastMessage: React.FC<BroadcastMessageProps> = ({ broadcast, isRead, onRead, isVolunteer }) => {
    //console.log(broadcast)
    return (
        <Grid onClick={isVolunteer ? () => onRead!(broadcast.id, true) : () => console.log("not a volunteer")} style={{ display: "flex", flexDirection: "column", padding: 10, margin: 5, border: isRead ? "1px solid gray" : "1.5px solid black", fontWeight: isRead ? 200 : 800, cursor: "pointer" }}>
            <Box style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <h2 style={{ marginTop: 2, marginBottom: 2, fontWeight: isRead ? 200 : 800 }}>{broadcast.subject}</h2>
                {isRead && <button onClick={() => onRead!(broadcast.id, false)}>Mark as unread</button>}
            </Box>
            <hr />
            <p style={{ marginBottom: 2, marginTop: 2 }}>{broadcast.message}</p>
            <hr />
            <p style={{ marginBottom: 2, marginTop: 2 }}>{`Sent at ${broadcast.sentTime.substring(0, 21)}`}</p>
            {broadcast.receiverEmails &&
                <>
                    <p>to: </p>
                    {broadcast.receiverEmails.map((email) => <p key={email}>{email}</p>)}
                </>}
        </Grid>
    )
}

export default BroadcastMessage

