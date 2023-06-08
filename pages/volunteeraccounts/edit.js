import dbConnect from "../../lib/dbConnect"
import getVolunteerAccountModel from "../../models/VolunteerAccount"
import {useState} from 'react'
import { Button } from "@mui/material"
import { getStates } from "../../lib/enums"
const EditVolunteerAccount = (props) => {
    const states = getStates()
    const error = props.error
    const alp_id = props.alp_id
    const volunteerAccount = JSON.parse(props.account)

    const [email, setEmail] = useState(volunteerAccount.email)
    const [location, setLocation] = useState(volunteerAccount.location)
    const [isEdited, setIsEdited] = useState(false)
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const handleLocationChange = (event) => {
        setLocation(event.target.value)
    }
    const editVolunteerAccount = async() => {
        try {
            const data = {
                alp_id: alp_id,
                email: email,
                location: location,
            }
            const resJson = await fetch("/api/volunteeraccounts", {
                method: "PATCH",
                body: JSON.stringify(data),
            }).then(res => res.json())
            if (resJson.success) setIsEdited(true)
            else alert(`something went wrong`)
        } catch (e) {
            console.error(e)
        }
    }
    if (!isEdited)
        return (
            <div>
                {volunteerAccount &&
                <div>
                    <p>Update your email</p>
                    <input type="text" value={email} onChange={handleEmailChange}/>
                    <br></br>
                    <p>Update your location</p>
                    <select onChange={handleLocationChange} value={location}>
                        {
                            states.map((state) => (
                               <option key={state.index} value={state.index}>{state.name}</option> 
                            ))
                        }
                    </select>
                    <br></br>
                    <Button onClick={editVolunteerAccount}>Click here to submit changes</Button>
                </div>
                }
                {error &&
                <p>
                    something went wrong - we cannot find the account with id {alp_id} : {error}
                </p>
                }
                <Button href={`/volunteeraccounts/profile?alp_id=${alp_id}`}>Click here to go back</Button>
            </div>
        )
    else return (
        <div>
            <p>Updated Information:</p>
            <br></br>
            <p>Email: {email}</p>
            <br></br>
            <p>location: {states[location-1].name}</p>
            <br></br>
            <Button href={`/volunteeraccounts/profile?alp_id=${alp_id}`}>Click here to see your profile</Button>
        </div>
    )
}

export const getServerSideProps = async(context) => {
    try {
        await dbConnect()
        const alp_id = context.query.alp_id
        const VolunteerAccount = getVolunteerAccountModel()
        const volunteerAccount = await VolunteerAccount.findOne({alp_id: alp_id})
        return {props: {account: JSON.stringify(volunteerAccount), alp_id: alp_id, error: null}}
    } catch (e) {
        console.error(e)
        const strError = `${e}`
        return {props: {account: null, alp_id: null, error: strError}}
    }
}
export default EditVolunteerAccount