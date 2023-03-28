// import '../css/style.css'
// import '../css/form.css'
import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { ClientRequest } from 'http';
import {useState } from 'react'
const mongoose = require('mongoose')
import dbConnect from '../lib/dbConnect'
import getPetModel from '../models/Pet'
import getVolunteerAccountModel from '../models/VolunteerAccount';
// import signUp from '../backend/UserController'

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
            let result = await fetch('/api/volunteerAccounts/user', {
                method: "POST",
                body: JSON.stringify(data),
            });
            console.log(result)
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


// async function signUp(email, password) {
//     try {
//         console.log("signup called")
//         await dbConnect()
//         const VolunteerAccount = getVolunteerAccountModel()
//         const volunteerAccount = new VolunteerAccount({
//             fname: "test_fname",
//             lname: "test_lname",
//             alp_id: 2,
//             ageBucket: 1,
//             email: email,
//             pwhash: password,
//             location: 5,
//             dateJoined: 0,
//             allDrives: 0,
//             badges: 0
//         })
//         await volunteerAccount.save()
//         console.log(volunteerAccount)
//         return {email: "this worked", password: "this worked"}
//     } catch (e){
//         console.error(e)
//     }
// }



export default Login