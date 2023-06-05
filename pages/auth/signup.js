import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Link from 'next/link';
import Router from 'next/router'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';

const Signup = () => {
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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

    const signUpHandler = async () => {
        try {
            const data = { fname: fname, lname: lname, email: email, password: password }
            const res = await fetch('../api/volunteeraccounts', {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (res.status == 200) Router.push('/dash-volunteer')
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
                <Image className="auth-logo" src="/logo-long.png" width={956*0.3} height={295*0.3} alt="ALP-logo" sx={{
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