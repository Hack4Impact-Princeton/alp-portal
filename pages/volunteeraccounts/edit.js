import dbConnect from "../../lib/dbConnect"
import getVolunteerAccountModel from "../../models/VolunteerAccount"
import { useState } from 'react'
import { Button } from "@mui/material"
import { getStates } from "../../lib/enums"
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]';

const EditVolunteerAccount = (props) => {
    const volunteerAccount = props.account ? JSON.parse(props.account): null
    const error = props.error ? props.error: null
    const states = getStates()
    
    console.log(volunteerAccount)
    // if the user is not authenticated take them back to the login page
    

    const [email, setEmail] = useState(volunteerAccount ? volunteerAccount.email : null)
    const [state, setState] = useState(volunteerAccount ? volunteerAccount.state : null)
    const [isEdited, setIsEdited] = useState(false)

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const handleStateChange = (event) => {
        setState(event.target.value)
    }
    const editVolunteerAccount = async () => {
        try {
            const data = {
                email: email,
                state: state,
            }
            const resJson = await fetch(`/api/volunteeraccounts/${volunteerAccount.email}`, {
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
                        <input type="text" value={email} onChange={handleEmailChange} />
                        <br></br>
                        <p>Update your state</p>
                        <select onChange={handleStateChange} value={state}>
                            {
                                states.map((state) => (
                                    <option key={state.index} value={state.index}>{state.name}</option>
                                ))
                            }
                        </select>
                        <br></br>
                        <Button onClick={editVolunteerAccount}>Click here to submit changes</Button>
                        <Button href={`/volunteeraccounts/profile`}>Click here to go back</Button>
                    </div>
                }
                {error &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px", flexDirection: "column" }}>
                        <h1>{error}</h1>
                        {// when the error is not auth error, give them the option to go back
                        error !== "You must login before accessing this page" &&
                            <Link href="/dash-volunteer">
                                <button width="50px" height="50px" borderRadius="20%">Volunteer Dashboard</button>
                            </Link>}
                    </div>
                }
            </div>
        )
    else return (
        <div>
            <p>Updated Information:</p>
            <br></br>
            <p>Email: {email}</p>
            <br></br>
            <p>State: {states[state - 1].name}</p>
            <br></br>
            <Button href={`/volunteeraccounts/profile`}>Click here to see your profile</Button>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    try {
        await dbConnect()
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return {
                redirect: {
                    destination: 'auth/login',
                    permanent: false,
                }
            }
        }
        const email = session.user.email
        console.log(session.user)
        const VolunteerAccount = getVolunteerAccountModel()
        const volunteerAccount = await VolunteerAccount.findOne({ email: email })
        return { props: { account: JSON.stringify(volunteerAccount), error: null } }
    } catch (e) {
        console.error(e)
        let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { account: null, alp_id: null, error: strError } }
    }
}
export default EditVolunteerAccount