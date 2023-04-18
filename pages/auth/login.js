import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { ClientRequest } from 'http';
import {useState } from 'react'

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
        <div>
        {/* TODO: <img src="" alt="ALP-logo"/> */}
        <h2> ALP Volunteer Portal Login </h2>
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
        </Box>
        </div>
    )
}

export default Login