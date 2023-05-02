import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ClientRequest } from 'http';
import {useState } from 'react';
import Image from 'next/image';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSetEmail = (emailText) => {
        setEmail(emailText.target.value)
    }
    const handleSetPassword = (passwordText) => {
        setPassword(passwordText.target.value)
    }

    const signUpHandler = async () => {
        try {
            const data = {email: email, password: password}
            await fetch('/api/volunteeraccounts', {
                method: "POST",
                body: JSON.stringify(data),
            });
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Grid2 container spacing={12} justifyContent="center" textAlign="center">
            <Grid2 xs={12} display="flex" justifyContent="center" alignItems="center">
                
            </Grid2>
                <Grid2 xs={12} spacing={10}>
                    <Image className="auth-logo" src="/logo-long.png" width={956*0.3} height={295*0.3} alt="ALP-logo" sx={{
                        marginBottom: "10 !important",
                    }}/>
                    <h2 className='auth-heading'> Volunteer Portal Login </h2></Grid2>
                <Grid2 xs={12}
                    display="flex"
                    sx={{   
                        width: 400,
                        height: 300,
                        backgroundColor: 'white',
                    }}>
                    <Grid2 xs={12} display="flex" justifyContent="center" alignItems="center">
                        <Box
                            textAlign="center"
                            sx={{
                                width: 300,
                                height: 300,
                            }}
                            >
                            <TextField fullWidth required id="email" label="Email" variant="outlined" 
                                value={email}
                                onChange={handleSetEmail}
                                sx={{
                                    mt: 2,
                                    mb: 2
                                }}/>
                            <TextField fullWidth 
                                required id="password" label="Password" variant="outlined" 
                                value={password} onChange={handleSetPassword}
                                sx={{
                                    mt: 2,
                                    mb: 2
                                }}/>
                            <Button variant="contained"
                                sx={{
                                    marginTop: 3,
                                }}>Login</Button>
                            <Button variant="contained"
                                onClick={signUpHandler}
                                sx={{
                                    marginTop: 3,
                                    marginLeft: 3,
                                }}>Sign Up</Button>
                        </Box>
                    </Grid2>
                </Grid2>
                </Grid2>
    )
}

export default Login