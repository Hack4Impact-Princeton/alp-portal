import React from 'react'
import { useState } from 'react';
import dbConnect from "../../lib/dbConnect";
import mongoose from 'mongoose'
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

import getVolunteerAccountModel from "../../models/VolunteerAccount";
import { VolunteerAccount } from '../../models/VolunteerAccount';

// type LoginProps = {
//   accounts: VolunteerAccount[];
// }

const Login: NextPage = () => {
  // let accounts = JSON.parse(props.accounts);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // let emailsToPwhashs: { [key: string]: string } = {};
  // for (let i = 0; i < accounts.length; i++) {
  //   emailsToPwhashs[accounts[i]["email"]] = accounts[i]["pwhash"];
  // }

  // function verifyLogin() {

  //   const bcrypt = require("bcryptjs");
  //   console.log("Verifying credentials");

  //   if (
  //     email in emailsToPwhashs &&
  //     bcrypt.compare(password, emailsToPwhashs[email])
  //   ) {
  //     console.log("Good login");
  //     let alp_id: number | null = null;
  //     for (let i = 0; i < accounts.length; i++) {
  //       if (accounts[i].email == email) {
  //         alp_id = accounts[i].alp_id;
  //         break;
  //       }
  //     }
  //     router.push(`../dash-volunteer?alp_id=${alp_id}`);
  //     setSuccess(true);
  //     setDisabled(false);
  //   } else {
  //     setDisabled(true);
  //   }
  // }

  //
  const handleSetEmail = (emailText: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(emailText.target.value);
  };

  const handleSetPassword = (passwordText: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(passwordText.target.value);
  };
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // need to change to go to sign up page
  const signUpHandler = async () => {
    Router.push("/auth/signup")
  };

  const handleSubmit = async (isAdmin: boolean) => {
    // validate user information
    console.log("typeof isADmin", typeof isAdmin)
    console.log("isAdmin", isAdmin)
    const res = await signIn('credentials', {
      email: email,
      password: password,
      isAdmin: isAdmin,
      redirect: false,
    })
    console.log(res)
    if (!res) {
      alert("Something went wrong: please try again")
      return
    }
    if (res.ok) {
      console.log("Redirecting to dash")
      Router.push(`../dash-volunteer`)
    }
    else {
      alert("Email or password is incorrect. Please try again")
      console.log(`something went wrong: ${res.error}`) 
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
        <Image className="auth-logo" src="/logo-long.png" width={956 * 0.3} height={295 * 0.3} alt="ALP-logo" style={{
          marginBottom: "10 !important",
        }} />
        <h2 className='auth-heading'> Volunteer Portal Login </h2>
      </Grid2>
      <Grid2>
        <Grid2 xs display="flex" justifyContent="center">
          <Box
            sx={{
              width: 400,
              height: 225,
            }}>
            <TextField fullWidth required id="email" label="Email" variant="outlined"
              value={email}
              onChange={handleSetEmail}
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

            <Button variant="contained"
              onClick={() => handleSubmit(false)}
              style={{
                backgroundColor: '#3b1e1e',
                marginTop: 2,
                
              
              }}>Volunteer Login</Button>
            <Button variant="contained"
              onClick={() => handleSubmit(true)}
              style={{
                backgroundColor: '#3b1e1e',
                marginTop: 2,
                marginLeft: 10,
                
              }}>Admin Login</Button>
            
            
            
          </Box>

        </Grid2>

        <Link href='signup'>Create An Account?</Link>
        <Box sx={{
          marginTop: 1,
        }}></Box>
        
        <Link href='resetpassword'>Forgot Password?</Link>

      </Grid2>
    </Grid2>
  )
}

export default Login;