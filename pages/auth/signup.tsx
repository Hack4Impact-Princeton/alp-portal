import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Link from 'next/link';
import Router from 'next/router'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import {getStates} from '../../lib/enums'

const Signup = () => {
    const states: {
        name: string;
        index: number;
    }[] = getStates()
        
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState(1)

    const handleSetFName = (fName: React.ChangeEvent<HTMLInputElement>) => {
        setFName(fName.target.value)
    }
    const handleSetLName = (lName: React.ChangeEvent<HTMLInputElement>) => {
        setLName(lName.target.value)
    }
    const handleSetEmail = (emailText: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(emailText.target.value)
    }
    const handleSetPassword = (passwordText: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(passwordText.target.value)
    }
    const handleSetLocation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocation(Number(event.target.value));
    }

    const signUpHandler = async () => {
        try {
            const bcrypt = require("bcryptjs");
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = bcrypt.hashSync(password, salt);

            const data = { fname: fname, lname: lname, email: email, password: hashedPwd, location: location }
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
        <Grid2 container className="auth-bg" justifyContent="center" textAlign="center" direction="column"
            sx={{
                width: '100vw',
                height: '100vh',
            }}>
            <Grid2 sx={{
                marginTop: '25px',
                width: '100%',
                height: '25%',
            }}>
                <Image className="auth-logo" src="/logo-long.png" width={956*0.3} height={295*0.3} alt="ALP-logo" style={{
                        marginBottom: "10 !important",
                }}/>
                <h2 className='auth-heading'>Sign up to volunteer with the African Library Project!</h2>
            </Grid2>
            <Grid2>
                <Grid2 xs display="flex" justifyContent="center">
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                        }}>
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
                </Grid2>
            </Grid2>
        </Grid2>
    )
}

export default Signup