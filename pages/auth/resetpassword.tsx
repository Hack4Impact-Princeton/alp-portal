import { NextPage } from "next"
import { useEffect, useState } from "react"
import Link from 'next/link'
import Router from "next/router"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image'
import { verify } from "crypto";
import { VolunteerAccount } from "../../models/VolunteerAccount";

const ResetPassword: NextPage = () => {
    const [email, setEmail] = useState("")
    // if true, only render email input/label/submit button
    const [showEmail, setShowEmail] = useState(true)
    const [code, setCode] = useState<Number | null>(null)
    // if true, only render code input/label/submit button + resend code button
    const [showCode, setShowCode] = useState(false)
    const [password, setPassword] = useState("")
    // if true, only render password input/label/submit button
    const [showPassword, setShowPassword] = useState(false)
    const [randNum, setRandNum] = useState(1000001)
    // records what time the code was last sent so someone can't use an expired code
    const [codeSentTime, setCodeSentTime] = useState<number>(Date.now())
    // if true, render the resend code button
    const [showResendCode, setShowResendCode] = useState(false)

    // whenever the showResendCode gets set to false and the resend code
    // button is hidden, make it visible after 20 seconds
    useEffect(() => {
        setTimeout(() => {
            setShowResendCode(true)
        }, 20000)
    }, [showResendCode])

    const sendCodeEmail = async (): Promise<void> => {
        try {
            const data = { email: email }
            // check to make sure that email is in our db
            const dupAccount: { error: Error | null, data: VolunteerAccount | null } = await fetch(`../api/volunteeraccounts?email=${encodeURIComponent(email)}`).then(res => res.json())
            if (!dupAccount.data) {
                alert(`No account found with email ${email}`)
                return
            }
            // send email
            const res: Response = await fetch('../api/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const resJson: { randNum: number } = await res.json()
            // if email sent correctly, update ui and alert user
            if (res.status == 200) {
                // console.log(res)
                // console.log(resJson.randNum)
                setCodeSentTime(Date.now())
                setShowEmail(false)
                setShowCode(true)
                setShowResendCode(false)
                setRandNum(resJson.randNum)
                alert(`An email containing a verification code was sent to ${email}`)
            } else throw new Error(`${res.status}`)
        } catch (e) {
            console.error(e)
        }
    }
    const verifyCode = () => {
        if (randNum != code) alert("Incorrect code")
        else if (Date.now() - codeSentTime >= 600000) alert("Code has expired. Please resend code and try again")
        else {
            // if the code is correct, update ui
            // console.log(code)
            setShowCode(false)
            setShowPassword(true)
        }
    }
    const updatePassword = async () => {
        try {
            // update existing account with new password
            const res = await fetch('../api/email/updatepassword', {
                method: "PATCH",
                body: JSON.stringify({ email: email, password: password })
            })
            if (res.status == 200) {
                alert("Password reset successful")
                Router.push('/auth/login')
            }
        } catch (e) {
            console.error(e)
            alert('something went wrong')
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
                <h2 className='auth-heading'> Password Reset </h2>
            </Grid2>
            <Grid2>
                <Grid2 xs display="flex" justifyContent="center">
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                        }}>
                        {showEmail &&
                            <>
                                <label htmlFor="email">Please enter the email address associated with your account</label>
                                <TextField fullWidth required id="email" label="Email" variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
                                        mt: 2,
                                        mb: 2
                                    }} />
                                <Button variant="contained"
                                    onClick={sendCodeEmail}
                                    sx={{
                                        marginTop: 3,
                                    }}>Send Email</Button>
                            </>
                        }
                        {showCode &&
                            <>
                                <label htmlFor="code">{`Please enter the code sent to ${email}`}</label>
                                <TextField fullWidth
                                    required id="code" label="Code" variant="outlined" type="number"
                                    value={code} onChange={(e) => setCode(Number(e.target.value))}
                                    sx={{
                                        mt: 2,
                                        mb: 2
                                    }} />
                                <Button variant="contained"
                                    onClick={verifyCode}
                                    sx={{ marginTop: 3 }}>Submit </Button>
                                {showResendCode && <Button variant="contained"
                                    onClick={sendCodeEmail}
                                    sx={{
                                        marginTop: 3,
                                        marginLeft: 3,
                                    }}>Resend code</Button>}
                            </>
                        }
                        {showPassword &&
                            <>
                                <label htmlFor="password">Please enter a new password</label>
                                <TextField fullWidth
                                    required id="password" label="Password" variant="outlined"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    sx={{
                                        mt: 2,
                                        mb: 2
                                    }} />
                                <Button variant="contained"
                                    onClick={updatePassword}
                                    sx={{
                                        marginTop: 3,
                                        marginLeft: 3,
                                    }}>Update Password</Button>
                            </>
                        }
                    </Box>
                </Grid2>
            </Grid2>
            {showCode && <p>Tip: if at first you don't see the email, check your spam folder</p>}
        </Grid2>
    )

}
export default ResetPassword