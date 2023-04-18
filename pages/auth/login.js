// import '../css/style.css'
// import '../css/form.css'
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ClientRequest } from "http";
import getVolunteerAccountModel from "../../models/VolunteerAccount";
import dbConnect from "../../lib/dbConnect";
import { useRouter } from "next/router";

function Login(props) {
  let drives = JSON.parse(props.drives);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let [disabled, setDisabled] = useState(false);
  let [success, setSuccess] = useState(false);

  let emailsToPwhashs = {};
  for (let i = 0; i < drives.length; i++) {
    emailsToPwhashs[drives[i]["email"]] = drives[i]["pwhash"];
  }

  function verifyLogin() {
    if (email in emailsToPwhashs && emailsToPwhashs[email] == password) {
      console.log("Good login");
      router.push("/dash-volunteer");
      setSuccess(true);
      setDisabled(false);
    } else {
      console.log("Bad login");
      setDisabled(true);
    }
  }

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
            onChange={handleSetEmail}
            fullWidth
            required
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
          <TextField
            onChange={handleSetPassword}
            fullWidth
            required
            id="password"
            label="Password"
            variant="outlined"
            value={password}
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
          <Button
            variant="contained"
            onClick={signUpHandler}
            sx={{
              marginTop: 3,
              marginLeft: 3,
            }}
          >
            Sign Up
          </Button>
          {disabled && <div> Error in login </div>}
          {success && (
            <div> Successful Login, please wait to be redirected</div>
          )}
        </Box>
      </Box>
    </div>
  );
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

export default Login;
