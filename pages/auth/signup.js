import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Link from 'next/link';
import Router from 'next/router'

const Signup = () => {
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

    
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState(1)

    const handleSetFName = (fName) => {
        setFName(fName.target.value)
    }
    const handleSetLName = (lName) => {
        setLName(lName.target.value)
    }
    const handleSetEmail = (emailText) => {
        setEmail(emailText.target.value)
    }
    const handleSetPassword = (passwordText) => {
        setPassword(passwordText.target.value)
    }
    const handleSetLocation = (event) => {
        setLocation(event.target.value);
    }

    const signUpHandler = async () => {
        try {
            const data = { fname: fname, lname: lname, email: email, password: password, location: location }
            const res = await fetch('../api/volunteeraccounts', {
                method: "POST",
                body: JSON.stringify(data),
            })
            const resJson = await res.json()
            if (res.status == 200) {
                const href=`/dash-volunteer?alp_id=${resJson.alp_id}`
                Router.push(href)
            } throw new Error(`error with status ${res.status}`)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <div>
            {/* TODO: <img src="" alt="ALP-logo"/> */}
            <h2> Sign up to volunteer with African Library Project! </h2>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: 400,
                    height: 400,
                    backgroundColor: 'white',
                    border: 3,
                    borderColor: 'orange',
                }}>
                <Box
                    textAlign="center"
                    sx={{
                        width: 300,
                        height: 300,
                    }}
                >
                    <TextField fullWidth required id="fname" label="First Name" variant="outlined"
                        value={fname} onChange={handleSetFName}
                        sx={{
                            mt: 2,
                            mb: 2
                        }} />
                    <TextField fullWidth required id="lname" label="Last Name" variant="outlined"
                        value={lname} onChange={handleSetLName}
                        sx={{
                            mt: 2,
                            mb: 2
                        }} />
                    <TextField fullWidth required id="email" label="Email" variant="outlined"
                        value={email} onChange={handleSetEmail}
                        sx={{
                            mt: 2,
                            mb: 2
                        }} />
                    <TextField fullWidth required id="password" label="Password" variant="outlined"
                        value={password} onChange={handleSetPassword}
                        sx={{
                            mt: 2,
                            mb: 2
                        }} />
                    <select onChange={handleSetLocation}>
                        {
                            states.map((state) => (
                               <option key={state.index} value={state.index}>{state.name}</option> 
                            ))
                        }
                    </select>
                    <br></br>
                    <Button variant="contained"
                        onClick={signUpHandler}
                        sx={{
                            marginTop: 3,
                        }}>Signup</Button>
                </Box>
            </Box>
        </div>
    )
}

export default Signup