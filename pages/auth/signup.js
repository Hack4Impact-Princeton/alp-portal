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
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signup = () => {
    const states = getStates()
    const [submit, setSubmit] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState(1)
    const [showPassword, setShowPassword] = useState(false);

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
    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
      };
    

    const signUpHandler = async () => {
        try {
            // set timeout for reseting error fields
            setSubmit(true)
            setTimeout(() => {
                setSubmit(false)
              }, "4000");

            const bcrypt = require("bcryptjs");
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = (password == '')?'':bcrypt.hashSync(password, salt);
            const data = { fname: fname, lname: lname, email: email, password: hashedPwd, location: location }
            // return if empty field
            for (let entry in data) 
                if (data[entry] == '') return;
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
                            <TextField fullWidth required error={submit && fname==''} id="fname" label="First Name" variant="outlined" 
                            value={fname} onChange={handleSetFName} 
                            sx={{
                                mt: 2,
                                mb: 2
                            }} />
                            <TextField fullWidth required error={submit && lname==''} id="lname" label="Last Name" variant="outlined"
                                value={lname} onChange={handleSetLName} 
                                sx={{
                                    mt: 2,
                                    mb: 2
                                }}/>
                            <TextField fullWidth required error={submit && email==''} id="email" label="Email" variant="outlined"
                                value={email} onChange={handleSetEmail} 
                                sx={{
                                    mt: 2,
                                    mb: 2
                                }} />
                             <TextField fullWidth required id="password" label="Password" variant="outlined"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={handleSetPassword}
                          InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword}>
                                         {showPassword ? <VisibilityOff /> : <Visibility />}
                                   </IconButton>
                               </InputAdornment>
                              ),
                           }}
                          sx={{
                          mt: 2,
                         mb: 2,
                          }}
                        />
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