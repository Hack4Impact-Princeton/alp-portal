// import '../css/style.css'
// import '../css/form.css'
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ClientRequest } from "http";

const Login = () => {

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
            variant="contained"
            sx={{
              marginTop: 3,
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
