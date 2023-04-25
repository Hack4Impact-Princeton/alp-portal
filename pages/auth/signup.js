import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Link from "next/link";
import Router from "next/router";

const Signup = () => {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSetFName = (fName) => {
    setFName(fName.target.value);
  };
  const handleSetLName = (lName) => {
    setLName(lName.target.value);
  };
  const handleSetEmail = (emailText) => {
    setEmail(emailText.target.value);
  };
  const handleSetPassword = (passwordText) => {
    setPassword(passwordText.target.value);
  };

  const signUpHandler = async () => {
    try {
      
      var bcrypt = require("bcryptjs");
      var salt = bcrypt.genSaltSync(10);
      var hashedPwd = bcrypt.hashSync(password, salt);
      
      const data = {
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPwd,
      };
      const res = await fetch("../api/volunteeraccounts", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.status == 200) Router.push("/dash-volunteer");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      {/* TODO: <img src="" alt="ALP-logo"/> */}
      <h2> Sign up to volunteer with African Library Project! </h2>
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
            fullWidth
            required
            id="fname"
            label="First Name"
            variant="outlined"
            value={fname}
            onChange={handleSetFName}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            required
            id="lname"
            label="Last Name"
            variant="outlined"
            value={lname}
            onChange={handleSetLName}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleSetEmail}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={handleSetPassword}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
          <Button
            variant="contained"
            onClick={signUpHandler}
            sx={{
              marginTop: 3,
            }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Signup;
