import '../css/style.css'
import '../css/form.css'
import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const Login = () => {
    return (
            <div>
            <img src="" alt="ALP-logo"/>
            <TextField required id="Username" label="Username" variant="outlined" color="orange"/>
            <TextField required id="Password" type="password" label="Password" variant="outlined" color="orange"/>
            <Button variant="contained" color="orange">Login</Button>
            </div>
    )
}

export default Login