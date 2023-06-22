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
import { signIn } from 'next-auth/react'
import dbConnect from '../../lib/dbConnect'
import getVolunteerAccountModel from '../../models/VolunteerAccount'

const Signup = (props) => {
    // const error = props.error ? props.error : null
    // const accounts = props.account ? JSON.parse(props.accounts) : null
    const states = getStates()
    const [submit, setSubmit] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState(1)
    const [showPassword, setShowPassword] = useState(false);

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
            const dupAccount = await fetch(`../api/volunteeraccounts?email=${encodeURIComponent(email)}`).then(res => res.json())
            if (dupAccount.data) {
                console.log(dupAccount)
                console.log('duplicate account')
                alert("An account with this email already exists.")
                return
            }
            console.log('not duplicate account')
            const res = await fetch('../api/volunteeraccounts', {
                method: "POST",
                body: JSON.stringify(data),
            })
            if (res.status != 200) throw new Error(`error with status ${res.status}`)
            const signInRes = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
              })
              if (signInRes.ok) Router.push(`../dash-volunteer`)
            console.log("success")
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


// export const getServerSideProps = async() => {
//     try {
//         await dbConnect()
//         const VolunteerAccount = getVolunteerAccountModel()
//         const accounts = await VolunteerAccount.find({})
//         return {props: {accounts: JSON.stringify(accounts), error: null}}
//     } catch (e) {
//         console.log(e)
//         const err = `${e}`
//         return {props: {error: err, accounts: null}}
//     } 
//}
export default Signup