import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ClientRequest } from 'http';
import {useState } from 'react';
import Image from 'next/image';
import dbConnect from "../../lib/dbConnect";
import getVolunteerAccountModel from "../../models/VolunteerAccount";
import { useRouter } from "next/router";


function Login(props) {
  let accounts = JSON.parse(props.accounts);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let [disabled, setDisabled] = useState(false);
  let [success, setSuccess] = useState(false);

  let emailsToPwhashs = {};
  for (let i = 0; i < accounts.length; i++) {
    emailsToPwhashs[accounts[i]["email"]] = accounts[i]["pwhash"];
  }

  function verifyLogin() {
    console.log("Verifying credentials");
    if (email in emailsToPwhashs && emailsToPwhashs[email] == password) {
      console.log("Good login");
      let alp_id
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
          alp_id = accounts[i].alp_id
          break
        }
      }
      router.push(`../dash-volunteer?alp_id=${alp_id}`);
      setSuccess(true);
      setDisabled(false);
    } else {
      console.log("Bad login");
      setDisabled(true);
    }
  }
//
  const handleSetEmail = (emailText) => {
    setEmail(emailText.target.value);
  };

  const handleSetPassword = (passwordText) => {
    setPassword(passwordText.target.value);
  };

  const signUpHandler = async () => {
    try {
      const data = { email: email, password: password };
      await fetch("/api/volunteeraccounts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
  };

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
                <h2 className='auth-heading'> Volunteer Portal Login </h2>
            </Grid2>
            <Grid2>
                <Grid2 xs display="flex" justifyContent="center">
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                        }}>
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
                            onClick={verifyLogin}
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
export async function getServerSideProps() {
  await dbConnect();
  const VolunteerAccount = getVolunteerAccountModel();
  /* find all the data in our database */
  const accounts = await VolunteerAccount.find({});
  // stringify data before sending
  return { props: { accounts: JSON.stringify(accounts) } };
}
export default Login;
