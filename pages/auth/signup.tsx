import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import Router from 'next/router'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import { getStates } from '../../lib/enums'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from 'next-auth/react'
import Link from 'next/link';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Signup = () => {
    const states = getStates()
    const [submit, setSubmit] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState(1)
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (input: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(input);
    };

    const handleSetFName = (fName: React.ChangeEvent<HTMLInputElement>) => {
        setFName(fName.target.value)
    }
    const handleSetLName = (lName: React.ChangeEvent<HTMLInputElement>) => {
        setLName(lName.target.value)
    }
    const handleSetEmail = (emailText: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(emailText.target.value)
        setIsValidEmail(validateEmail(emailText.target.value));
    }
    const handleSetPassword = (passwordText: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(passwordText.target.value)
    }
    const handleSetLocation = (event: any) => {
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
            }, 4000);

            const bcrypt = require("bcryptjs");
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = (password == '') ? '' : bcrypt.hashSync(password, salt);
            const data = { fname: fname, lname: lname, email: email, pwhash: hashedPwd, location: location }
            // return if empty field
            for (let entry in data)
                if (entry == '') return;
            const dupAccount = await fetch(`../api/volunteeraccounts/${encodeURIComponent(email)}`).then(res => res.json())
            if (!isValidEmail) {
                console.log("Invalid email address");
                alert("Please enter a valid email");
                return
            }
            if (dupAccount.data) {
                alert("An account with this email already exists.")
                return
            }
            console.log('not duplicate account')
            const res = await fetch(`../api/volunteeraccounts/${email}`, {
                method: "POST",
                body: JSON.stringify(data),
            })
            if (res.status != 200) throw new Error(`error with status ${res.status}`)
            const signInRes = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            })
            if (signInRes?.ok) Router.push(`../dash-volunteer`)
            console.log("success")
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Grid2 container className="auth-bg" justifyContent="space-between" textAlign="center" direction="column"
            sx={{
                width: '100%',
            }}>
            <Grid2 sx={{
                width: '100%',
                height: 'wrap-content',
                mt: "4%",
                mb: "1%"
            }}>

                <Image className="auth-logo" src="/logo-long.png" width={956 * 0.225} height={295 * 0.225} alt="ALP-logo" style={{
                }} />
            </Grid2>
            <Grid2 justifySelf="flex-start" flexDirection="column">
                <Grid2 xs display="flex" flexDirection="column" justifyContent="flex-start" alignItems="start">
                    <Box
                        sx={{
                            width: 300,
                            height: "wrap-content",
                        }}>
                        <TextField size="small" fullWidth required error={submit && fname == ''} id="fname" label="first name" variant="filled"
                            value={fname} onChange={handleSetFName}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"
                            }} />
                        <TextField size="small" fullWidth required error={submit && lname == ''} id="lname" label="last name" variant="filled"
                            value={lname} onChange={handleSetLName}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"
                            }} />
                        <TextField size="small" fullWidth required error={submit && email == ''} id="email" label="email" variant="filled"
                            value={email} onChange={handleSetEmail}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"

                            }} />
                        <TextField size="small" fullWidth required id="password" label="password" variant="filled"
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
                                mb: 3,
                                border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"
                            }}
                        />
                        <FormControl required variant="filled" size="small" sx={{ width: 300, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: 3 }}>
                            <InputLabel id="state-label">state</InputLabel>
                            <Select
                                onChange={handleSetLocation}
                                input={<OutlinedInput label="State" />}
                            >
                                {
                                    states.map((state) => (
                                        <MenuItem key={state.index} value={state.index} >{state.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br></br>
                        <p style={{ fontSize: 10, color: "white" }}>You can unsubscribe at any time by clicking the link in the footer of our emails. For information about our privacy practices, please visit our website.</p>
                        <Button variant="contained"
                            onClick={signUpHandler}
                            sx={{
                                marginTop: 2,
                                borderRadius: 2,
                                color: "white",
                                fontWeight: 500,
                                backgroundColor: "black",
                                "&:hover": { backgroundColor: "#555555" },
                                mb: 2
                            }}>Sign up</Button>
                    </Box>
                </Grid2>
                <Link passHref style={{ color: "white" }} href="/auth/login">
                    <a style={{ color: "white", textDecoration: "none" }}>
                        Already have an account?
                    </a>
                </Link>
            </Grid2>
        </Grid2>
    )
}

export default Signup