<<<<<<< HEAD:pages/login.js
// import '../css/style.css'
// import '../css/form.css'
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ClientRequest } from "http";
import getVolunteerAccountModel from "../models/volunteerAccounts";
import dbConnect from "../lib/dbConnect";

function Login(props) {
  let drives = JSON.parse(props.drives);

  let [disabled, setDisabled] = useState(true);

  let emailsToPwhashs = {};
  for (let i = 0; i < drives.length; i++) {
    emailsToPwhashs[drives[i]["email"]] = drives[i]["pwhash"];
  }

  function verifyLogin() {
    if (login in emailsToPwhashs && emailsToPwhashs[login] == pwd) {
      console.log("Good login");
      setDisabled(false);
    } else {
      console.log("Bad login");
    }
  }

  const [login, setLogin] = useState("NA");
  const changeLogin = (event) => {
    setLogin(event.target.value);
  };

  const [pwd, setPwd] = useState("NA");
  const changePwd = (event) => {
    setPwd(event.target.value);
  };

  if (disabled) {
=======
import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { ClientRequest } from 'http';

const Signup = () => {
>>>>>>> 6763b7cb65a524a896926b7a0691264589a6249c:pages/auth/signup.js
    return (
      <div>
        {/* TODO: <img src="" alt="ALP-logo"/> */}
<<<<<<< HEAD:pages/login.js
        <h2> ALP Volunteer Portal Login </h2>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 400,
            height: 400,
            backgroundColor: "white",
            border: 3,
            borderColor: "orange",
          }}
        >
          <Box
            textAlign="center"
            sx={{
              width: 300,
              height: 300,
            }}
          >
            <TextField
              onChange={changeLogin}
              fullWidth
              required
              id="email"
              label="Email"
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,
              }}
            />
            <TextField
              onChange={changePwd}
              fullWidth
              required
              id="password"
              label="Password"
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,
              }}
            />
            <Button
              onClick={verifyLogin}
              variant="contained"
              sx={{
                marginTop: 3,
              }}
            >
              Login
            </Button>
          </Box>
=======
        <h2> Sign up to volunteer with African Library Project! </h2>
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
                <TextField fullWidth required id="fname" label="First Name" variant="outlined"
                    sx={{
                        mt: 2,
                        mb: 2
                }}/>
                <TextField fullWidth required id="lname" label="Last Name" variant="outlined"
                    sx={{
                        mt: 2,
                        mb: 2
                }}/>
                <TextField fullWidth required id="email" label="Email" variant="outlined"
                    sx={{
                        mt: 2,
                        mb: 2
                    }}/>
                <TextField fullWidth required id="password" label="Password" variant="outlined"
                    sx={{
                        mt: 2,
                        mb: 2
                    }}/>
                <Button variant="contained"
                    sx={{
                        marginTop: 3,
                    }}>Signup</Button>
            </Box>
>>>>>>> 6763b7cb65a524a896926b7a0691264589a6249c:pages/auth/signup.js
        </Box>
      </div>
    );
  } else {
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
            backgroundColor: "white",
            border: 3,
            borderColor: "orange",
          }}
        >
          <Box
            textAlign="center"
            sx={{
              width: 300,
              height: 300,
            }}
          >
            <TextField
              onChange={changeLogin}
              fullWidth
              required
              id="email"
              label="Email"
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,
              }}
            />
            <TextField
              onChange={changePwd}
              fullWidth
              required
              id="password"
              label="Password"
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,
              }}
            />
            <Button
              onClick={verifyLogin}
              variant="contained"
              sx={{
                marginTop: 3,
              }}
            >
              Login
            </Button>

            <Button href="/dash-volunteer">Click here</Button>
          </Box>
        </Box>
      </div>
    );
  }
}

/* Keep example code here, nothing should be dynamic on the home page */
export async function getServerSideProps() {
  await dbConnect();
  const volunteerAccount = getVolunteerAccountModel();
  /* find all the data in our database */
  const drives = await volunteerAccount.find({});
  // stringify data before sending
  return { props: { drives: JSON.stringify(drives) } };
}
/* end example pet code */

<<<<<<< HEAD:pages/login.js
export default Login;
=======
export default Signup
>>>>>>> 6763b7cb65a524a896926b7a0691264589a6249c:pages/auth/signup.js
