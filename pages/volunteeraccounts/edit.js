import dbConnect from "../../lib/dbConnect"
import getVolunteerAccountModel from "../../models/VolunteerAccount"
import {useState} from 'react'
import { Button } from "@mui/material"
const EditVolunteerAccount = (props) => {
    const states = [
        {
            name: "Alabama",
            index: 1,
        },
        {
            name: "Alaska",
            index: 2,
        },
        {
            name: "Arizona",
            index: 3,
        },
        {
            name: "Arkansas",
            index: 4,
        },
        {
            name: "California",
            index: 5,
        },
        {
            name: "Colorado",
            index: 6,
        },
        {
            name: "Connecticut",
            index: 7,
        },
        {
            name: "Delaware",
            index: 8,
        },
        {
            name: "Florida",
            index: 9,
        },
        {
            name: "Georgia",
            index: 10,
        },
        {
            name: "Hawaii",
            index: 11,
        },
        {
            name: "Idaho",
            index: 12,
        },
        {
            name: "Illinois",
            index: 13,
        },
        {
            name: "Indiana",
            index: 14,
        },
        {
            name: "Iowa",
            index: 15,
        },
        {
            name: "Kansas",
            index: 16,
        },
        {
            name: "Kentucky",
            index: 17,
        },
        {
            name: "Louisiana",
            index: 18,
        },
        {
            name: "Maine",
            index: 19,
        },
        {
            name: "Maryland",
            index: 20,
        },
        {
            name: "Massachusetts",
            index: 21,
        },
        {
            name: "Michigan",
            index: 22,
        },
        {
            name: "Minnesota",
            index: 23,
        },
        {
            name: "Mississippi",
            index: 24,
        },
        {
            name: "Missouri",
            index: 25,
        },
        {
            name: "Montana",
            index: 26,
        },
        {
            name: "Nebraska",
            index: 27,
        },
        {
            name: "Nevada",
            index: 28,
        },
        {
            name: "New Hampshire",
            index: 29,
        },
        {
            name: "New Jersey",
            index: 30,
        },
        {
            name: "New Mexico",
            index: 31,
        },
        {
            name: "New York",
            index: 32,
        },
        {
            name: "North Carolina",
            index: 33,
        },
        {
            name: "North Dakota",
            index: 34,
        },
        {
            name: "Ohio",
            index: 35,
        },
        {
            name: "Oklahoma",
            index: 36,
        },
        {
            name: "Oregon",
            index: 37,
        },
        {
            name: "Pennslyvania",
            index: 38,
        },
        {
            name: "Rhode Island",
            index: 39,
        },
        {
            name: "South Carolina",
            index: 40,
        },
        {
            name: "South Dakota",
            index: 41,
        },
        {
            name: "Tennessee",
            index: 42,
        },
        {
            name: "Texas",
            index: 43,
        },
        {
            name: "Utah",
            index: 44,
        },
        {
            name: "Vermont",
            index: 45,
        },
        {
            name: "Virginia",
            index: 46,
        },
        {
            name: "Washington",
            index: 47,
        },
        {
            name: "West Virginia",
            index: 48,
        },
        {
            name: "Wisconsin",
            index: 49,
        },
        {
            name: "Wyoming",
            index: 50,
        }
    ]
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