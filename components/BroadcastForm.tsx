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
    // email addresses of the recipients
    const [recipients, setRecipients] = useState<string[]>(new Array<string>())

    const sendBroadcast = async () => {
        try {
            // recipients.filter(recipient => recipient !== '')
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
                subject: subject,
                message: message,
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
            setSubject("")
            setMessage("")
            setRecipients([])
            alert("Broadcast sent successfully")
        } catch (e: Error | any) {
            console.error(e)
        }
    }
    const updateRecipients = (event: any) => {
        if (!recipients.includes(event.target.value) && event.target.value != '--volunteers--')
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
                    <Select onChange={updateRecipients} defaultValue="--volunteers--"
                        input={<OutlinedInput label="Volunteer" />}>
                        <MenuItem key={0} value='--volunteers--'>{'--volunteers--'}</MenuItem>
                        {volunteers.map((volunteer) => (
                            <MenuItem key={volunteer.alp_id} value={volunteer.email}>{`${volunteer.fname} ${volunteer.lname.substring(0, 1)}.`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <label>Recipients:</label>
                <RecipientList recipients={recipients} onAddAll={addAllRecipients} onClear={() => setRecipients([])} onRemove={removeRecipient} />
            </Grid>
            <Grid item style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", width: "90%" }}>
                <TextField required error={submit && subject == ''} id="subject" label="Subject" placeholder="subject" variant="outlined"
                    value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                    sx={{
                        mb: 2,
                        width: "45%",
                        minWidth: "340px"
                    }} />
                <TextField required error={submit && message == ''} multiline minRows={6} maxRows={Infinity} label="Message" aria-label="message" placeholder="message" value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} style={{ width: "45%", minWidth: "340px" }} />
                <Button variant="contained" onClick={sendBroadcast} sx={{ marginTop: 1.5 }}>Send Broadcast </Button>
            </Grid>
        </Grid>

    )
}
export default BroadcastForm