import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// import div from '@mui/material/Unstable_div'; // Grid version 2
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';


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

    <div className="auth-bg"
      // style={{
      //   width: '100vw',
      //   height: '100vh',
      // }}
      >
      <div style={{
        // width: '100%',
        height: 'wrap-content',
      }}>
        <Image className="auth-logo" src="/logo-long.png" width={956 * 0.3} height={295 * 0.3} alt="ALP-logo" style={{
          marginBottom: "10 !important",
        }} />
      </div>
      <div>
        <div style={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 400,
              height: "wrap-content",
            }}>
            <TextField size="small" fullWidth color="warning" required className="email" id="email" label="email" variant="filled"
              value={email}
              onChange={handleSetEmail}
              sx={{
                mb: 2,
                backgroundColor: "white",
                border: "3px solid #FE9834",
                borderRadius: 2
              }} />
            <TextField size="small" fullWidth color="warning" required className="password" id="password" label="password" variant="filled"
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
                backgroundColor: "white",
                border: "3px solid #FE9834",
                borderRadius: 2
              }}
            />

            <Button variant="contained"
              onClick={() => handleSubmit(false)}
              sx={{
                backgroundColor: 'black',
                "&:hover": { backgroundColor: "#444444" },
                marginTop: 2,
                marginBottom: 5,
                width: "48%"
              }}>Volunteer Login</Button>
            <Button variant="contained"
              onClick={() => handleSubmit(true)}
              sx={{
                backgroundColor: 'black',
                "&:hover": { backgroundColor: "#444444" },
                marginTop: 2,
                marginLeft: 2,
                marginBottom: 5,
                width: "48%"
              }}>Admin Login</Button>



          </Box>

        </div>
        <br></br>
        <Link href='signup' passHref={true}>
          <a style={{ color: "white", textDecoration: "none" }}>
            Create An Account
          </a>
        </Link>
        <br />
        <br />
        <Link href='resetpassword' passHref={true}>
          <a style={{ textDecoration: "none", color: "white" }}>
            Forgot Password?
          </a>
        </Link>

      </div>
    </div >
  )
}

export default Login;