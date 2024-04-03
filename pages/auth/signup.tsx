import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
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
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { wrap } from 'module';

const Signup = () => {
    const states = getStates()
    const [submit, setSubmit] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [countryid, setCountryid] = useState(0);
    const [cityid, setCityid] = useState(0);
    const [stateid, setStateid] = useState(0);

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
    const handleSetState = (event: any) => {
        setStateid(Number(event.target.value));
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
            const data = { fname: fname, lname: lname, email: email, pwhash: hashedPwd, country: countryid, state: stateid, city: cityid }
            // return if empty field
            for (let entry in data)
                if (entry == '') return;
            if (!isValidEmail) {
                console.log("Invalid email address");
                alert("Please enter a valid email");
                return
            }
            const dupAccount = await fetch(`../api/volunteeraccounts/${encodeURIComponent(email)}`).then(res => res.json())
            if (dupAccount.data) {
                alert("An account with this email already exists.")
                return
            }
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
        } catch (e) {
            console.error(e)
        }
    }

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < window.screen.width * 0.6);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial screen width

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="auth-bg" >
            <div style={{
                height: 'wrap-content',
                marginTop: isSmallScreen? "7vw":"2vw" ,
                marginBottom: "1%",
            }}>
                

                <Image className="auth-logo" src="/logo-long.png" width={956 * 0.225} height={295 * 0.225} alt="ALP-logo" style={{
                }} />
            </div>
            <div style={{ display: "flex", justifySelf: "flex-start", flexDirection: "column", flexShrink: 1, alignItems: "center" }}>
                <div style = {{display: "flex",  flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: "space-between"}}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Box
                        sx={{
                            width: 350,
                            height: "wrap-content",
                        }}>
                        <TextField size="small" fullWidth required error={submit && fname == ''} id="fname" label="first name" variant="filled"
                            value={fname} onChange={handleSetFName}
                            sx={{
                                mb: 4, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"
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
                        </Box>
                        </div>
                    <div style={{ display: "flex", flexDirection: isSmallScreen ? 'column' : 'row', alignItems: "start", marginLeft: isSmallScreen ? 0: 10 }}></div>
                     <Box
                        sx={{
                            width: 350,
                            height: "wrap-content",
                        }}>
                            <FormControl required variant="filled" size="small" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 4.5 }}>          
                            <CountrySelect 
                                onChange={(e : any) => {
                                setCountryid(e.id);
                                }}
                                placeHolder="Country*"
                                        
                            />
                            </FormControl> 
                            <br></br>
                                   <FormControl required variant="filled" size="small" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 4.5}}>            
                            <StateSelect
                                countryid={countryid}
                                onChange={(e: any) => {
                                setStateid(e.id);
                                }}
                                placeHolder="State*"
                            />
                            </FormControl>      
                        <br></br>
                        <FormControl required variant="filled" size="small" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 4.5 }}>
                                <CitySelect
                                    countryid={countryid}
                                    stateid={stateid}
                                    onChange={(e: any) => {
                                    setCityid(e.id);
                                    }}
                                    placeHolder="City*"
                                            
                                />
                                </FormControl>
                        <br></br>
                        {/* <FormControl required variant="filled" size="small" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: 3 }}>
                            <InputLabel id="state-label">state</InputLabel>
                            <Select
                                onChange={handleSetState}
                                input={<OutlinedInput label="State" />}
                            >
                                {
                                    states.map((state) => (
                                        <MenuItem key={state.index} value={state.index} >{state.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl> */}
                                     </Box>
                                </div>
                        <br></br>
                        <div style={{width: isSmallScreen? 350:700}}> 
                            <p style={{ fontSize: 15, color: "white" }}>You can unsubscribe at any time by clicking the link in the footer of our emails. For information about our privacy practices, please visit our website.</p>
                        </div>
                    <Button variant="contained"
                    onClick={signUpHandler}
                    sx={{
                        marginTop: 2,
                        borderRadius: 2,
                        color: "white",
                        fontWeight: 600,
                        fontSize: 16,
                        backgroundColor: "black",
                        "&:hover": { backgroundColor: "#555555" },
                        mb: 2,
                        width: '150px',
                        height: '50px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontFamily:"Epilogue",
                    }}>Sign up</Button>

                </div>
                <Link passHref style={{ color: "white" }} href="/auth/login">
                    <a style={{ color: "white", textDecoration: "none",marginBottom: isSmallScreen? 20:0 }}>
                        Already have an account?
                    </a>
                </Link>
                </div>
                
    )

    
}

export default Signup