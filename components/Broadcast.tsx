import { Grid } from '@mui/material'
import { Broadcast } from '../models/Broadcast'
type BroadcastMessageProps = {
    broadcast: Broadcast,
}
const BroadcastMessage: React.FC<BroadcastMessageProps> = ({ broadcast }) => {
    console.log(broadcast)
    const {subject, message, receiverEmails, sentTime} = broadcast
    return (
        <Grid style={{ display: "flex", flexDirection: "column", padding: 10, margin: 5, border: "1.5px solid black" }}>
            <h2 style={{ marginTop: 2, marginBottom: 2 }}>{subject}</h2>
            <hr />
            <p style={{ marginBottom: 2, marginTop: 2 }}>{message}</p>
            <hr />
            <p style={{ marginBottom: 2, marginTop: 2 }}>{`Sent at ${sentTime.substring(0, 21)}`}</p>
            {receiverEmails &&
                <>
                    <p>to: </p>
                    {receiverEmails.map((email) => <p>{email}</p>)}
                </>}
        </Grid>
    )
}

export default BroadcastMessage

