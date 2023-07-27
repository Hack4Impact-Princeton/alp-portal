import { VolunteerAccount } from "../models/VolunteerAccount"
import { useState, useEffect, useRef } from "react"
import { Broadcast } from "../models/Broadcast"
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Button, Box, Grid, TextField } from '@mui/material'
import RecipientList from './RecipientList'
import genUniqueId from "../lib/idGen"

type BroadcastFormProps = {
    email: string,
    volunteers: VolunteerAccount[],
    addBroadcast: (broadcast: Broadcast) => void,
}
const BroadcastForm: React.FC<BroadcastFormProps> = ({ email, volunteers, addBroadcast }) => {
    const [message, setMessage] = useState("")
    const [subject, setSubject] = useState("")
    const [submit, setSubmit] = useState(false)
    const [showCustomBroadcast, setShowCustomBroadcast] = useState(false)
    // email addresses of the recipients
    const [recipients, setRecipients] = useState<string[]>([])

    const sendBroadcast = async (isAutomatedBroadcast: boolean) => {
        try {
            if (recipients.length == 0) {
                alert("You must send the message to at least one person")
                return
            }
            setSubmit(true)
            setTimeout(() => { setSubmit(false) }, 4000)
            const broadcast: Broadcast = {
                id: genUniqueId(),
                senderEmail: email,
                receiverEmails: recipients,
                read: new Array<boolean>(recipients.length).fill(false),
                sentTime: new Date().toString(),
                subject: isAutomatedBroadcast ? "automated broadcast subject" : subject,
                message: isAutomatedBroadcast ? "This is the message that volunteers will receive when they send an automated broadcast" : message,
            }
            console.log(broadcast)
            const res = await fetch(`/api/broadcast/${broadcast.id}`, {
                method: "POST",
                body: JSON.stringify(broadcast)
            })
            const resJson = await res.json()
            if (res.status !== 200) throw new Error(`something went wrong: ${resJson.data}`)
            addBroadcast(resJson.data)
            console.log("successfully sent out the broadcast", resJson.data)
            setShowCustomBroadcast(false)

        } catch (e: Error | any) {
            console.error(e)
        }
    }
    const updateRecipients = (event: any) => {
        if (!recipients.includes(event.target.value))
            setRecipients((prevRecipients) => [...prevRecipients, event.target.value]);
    }
    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter(recipient => recipient !== email))
    }
    const addAllRecipients = () => {
        setRecipients(volunteers.map(volunteer => volunteer.email))
    }
    return (

        <Grid container spacing="10" style={{ display: "flex", flexDirection: "column", margin: 'auto', padding: 10, width: "100%" }}>
            <Grid item style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <label htmlFor="volunteer-picker">Choose recipients</label>
                <FormControl id="volunteer-picker" sx={{ width: "25%", mt: 2, mb: 1 }}>
                    <InputLabel id="volunteer-label">Volunteer</InputLabel>
                    <Select onChange={updateRecipients}
                        input={<OutlinedInput label="Volunteer" />}>
                        {volunteers.map((volunteer) => (
                            <MenuItem key={volunteer.alp_id} value={volunteer.email}>{`${volunteer.fname} ${volunteer.lname.substring(0, 1)}.`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <label>Recipients:</label>
                <RecipientList recipients={recipients} onAddAll={addAllRecipients} onClear={() => setRecipients([])} onRemove={removeRecipient} />
            </Grid>
            {!showCustomBroadcast && <>
                <Button variant="contained" onClick={() => sendBroadcast(true)} sx={{ marginTop: 1.5 }}>Send Automated Broadcast </Button>
                <Button variant="contained" onClick={() => setShowCustomBroadcast(true)} sx={{ marginTop: 1.5 }}>Create Custom Broadcast </Button>
            </>
            }
            {showCustomBroadcast && 
            <Grid item style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", width: "90%" }}>
                
                <TextField required error={submit && subject == ''} id="subject" label="Subject" placeholder="subject" variant="outlined"
                    value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                    sx={{
                        mb: 2,
                        width: "45%",
                        minWidth: "340px"
                    }} />
                <TextField required error={submit && message == ''} multiline minRows={6} maxRows={Infinity} label="Message" aria-label="message" placeholder="message" value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} style={{ width: "45%", minWidth: "340px" }} />
                <Button variant="contained" onClick={() => sendBroadcast(false)} sx={{ marginTop: 1.5 }}>Send Broadcast </Button>
                <Button variant="contained" onClick={() => setShowCustomBroadcast(false)} sx={{ marginTop: 1.5 }}>Back</Button>

            </Grid>}
        </Grid>

    )
}
export default BroadcastForm