import { Grid } from '@mui/material'
import { Broadcast } from '../models/Broadcast'
type BroadcastMessageProps = {
    broadcast: Broadcast,
}
const BroadcastMessage: React.FC<BroadcastMessageProps> = ({ broadcast }) => {
    console.log(broadcast)
    const {subject, message, receiverEmails, sentTime} = broadcast
    return (
        <Grid style={{ display: "flex", flexDirection: "column", padding: 15, margin: 10, borderRadius:"5px", whiteSpace: 'normal', width: "80%",backgroundColor:"#F5F5F5" }}>
            <h2 style={{ marginTop: 2, marginBottom: 2,color:"#5F5F5F" }}>{subject}</h2>
            <br />
            <p style={{ marginBottom: 2, marginTop: 2,fontStyle:"italic" }}>{`Sent at ${sentTime.substring(0, 21)}`}</p>
            {receiverEmails &&
                <>
                    <span style={{fontStyle:"italic"}}>to:  
                    {receiverEmails.map((email) => <p style={{display: 'inline',fontStyle:"italic"}}> {email}</p>)}</span>
                </>}
            <br/>
            <p style={{ marginBottom: 2, marginTop: 2 }}>{message}</p>
            <br />
            
        </Grid>
    )
}

export default BroadcastMessage

