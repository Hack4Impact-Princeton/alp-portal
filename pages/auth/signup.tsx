import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Image from 'next/image';
import { getStates } from '../../lib/enums'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { SettingsInputAntennaOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
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
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

const CustomTextField = styled(TextField)({
    '& .MuiInputLabel-root': {
      fontFamily: "Epilogue",    
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Default border color
      },
      '&:hover fieldset': {
        borderColor: '#5F5F5F', // Border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#5F5F5F', // Border color when focused
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: 'Epilogue',   // Change font family
  
    },
  })



const Signup = () => {
    const states = getStates()
    const [submit, setSubmit] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [stateName, setStateName] = useState("");
    const [stateId, setStateId] = useState(0)
    const [countryId, setCountryId] = useState(0)

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
    const handleSetStateName = (event: any) => {
        setStateName(event.target.value);
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
            const data = { fname: fname, lname: lname, email: email, pwhash: hashedPwd, country: countryName, state: stateName, city: cityName }
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const styles = {
        btn: {
            backgroundColor: "#FE9834",
            width: "100%",
            fontFamily:"Epilogue",
            marginRight:6, 
            marginLeft: 6,
            fontWeight:'bold'
        },
        modal: {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display:"flex",
            flexDirection:"column",
            maxHeight: "70%",
            overflowY: "auto",
           // alignItems:"center",
            //justifyContent:"center",

        },

    };


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
                        <CustomTextField color="warning" size="small" fullWidth required error={submit && fname == ''} id="fname" label="First Name" variant="filled"
                            value={fname} onChange={handleSetFName}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white",fontFamily: 'Epilogue'
                            }} />
                        <CustomTextField size="small"color="warning" fullWidth required error={submit && lname == ''} id="lname" label="Last Name" variant="filled"
                            value={lname} onChange={handleSetLName}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"
                            }} />
                        <CustomTextField size="small" color="warning" fullWidth required error={submit && email == ''} id="email" label="Email" variant="filled"
                            value={email} onChange={handleSetEmail}
                            sx={{
                                mb: 3, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "white"

                            }} />

                        <CustomTextField size="small" color="warning" fullWidth required id="password" label="Password" variant="filled"
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
                            <FormControl required variant="filled" size="medium" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 3,padding:0.7}}>          
                            <CountrySelect 
                                onChange={(e : any) => {
                                setCountryId(e.id);
                                setCountryName(e.name);
                                }}
                                placeHolder="Country*"

                            />
                            </FormControl> 
                            <br></br>
                                   <FormControl required variant="filled" size="medium" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 3,padding:0.7}}>            
                            <StateSelect
                                countryid={countryId}
                                onChange={(e: any) => {
                                    setStateId(e.id)
                                    setStateName(e.state_code);
                                }}
                                placeHolder="State*"
                            />
                        </FormControl>
                        <br></br>
                        <FormControl required variant="filled" size="medium" sx={{ width: 350, border: "2px solid #FE9834", borderRadius: 2, backgroundColor: "#F5F5F5", mb: isSmallScreen? 3: 4.5,padding:0.7 }}>
                                <CitySelect
                                    countryid={countryId}
                                    stateid={stateId}
                                    onChange={(e: any) => {
                                        setCityName(e.name);
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
                            <p style={{ fontSize: 15, color: "white" }}>You can unsubscribe at any time by clicking the link in the footer of our emails. For information about our privacy practices, <span onClick={openModal} style={{color:"white", cursor: "pointer",textDecoration:"underline"}}>read here.</span></p>
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
                <Modal
                    open={isModalOpen}
                    aria-describedby="signup-input-modal"
                >
                    <Box sx={styles.modal} >
                        <h2>Privacy Notice for ALP Book Drive Organizer Portal</h2>
                        <br></br>
                        <p><span style={{fontWeight:"bold"}}>Effective Date:</span> July 2024</p>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Introduction</p>
                        <br></br>
                        <p>
                        Welcome to the African Library Project’s Volunteer Portal (&quot;Portal&quot;), operated by
                        [African Library Project] (&quot;ALP,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to
                        protecting your privacy and ensuring the security of your personal information. This
                        Privacy Policy explains how we collect, use, disclose, and safeguard your
                        information when you use our Portal.
                        </p>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Information We Collect</p>
                        <br></br>
                        <p>
                        When you register and use the ALP Volunteer Portal, we collect the following
personal information:
                        </p>
                        <br></br>
                        <ul>
                            <li>Name</li>
                            <li>Email Address</li>
                            <li>City and State</li>
                            <li>Organization (optional)</li>
                            <li>Interests (optional)</li>
                            <li>Profile picture (optional)</li>
                        </ul>
                        <br></br>
                        <p>Additionally, as you engage with the Portal, we may collect information through
your activity, including but not limited to:</p>
                        <br></br>
                        <ul>
                            <li>Questions and responses in the threads area</li>
                            <li>Messages sent to and received from other volunteers</li>
                            <li>Badges and achievements</li>
                            <li>Number of books collected</li>
                        </ul>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>How We Use Your Information</p>
                        <br></br>
                        <p>We use the information we collect for the following purposes:</p>
                        <br></br>
                        <ol>
                            <li><p style={{fontWeight:"bold"}}>To Provide and Enhance the Portal:</p>
                            <ul>
                                <li>Facilitate your participation and track your progress.</li>
                                <li>Enable you to learn, share, and make connections with other volunteers.</li>
                                <li>Provide you with relevant alerts and notifications.</li>
                            </ul>
                            </li>
                            <li>
                            <p style={{fontWeight:"bold"}}>To Improve Our Services:</p>
                            <ul>
                                <li>Understand how volunteers use the Portal to improve features and
user experience.</li>
                                <li>Gather feedback.</li>
                            </ul>
                            </li>
                            <li>
                            <p style={{fontWeight:"bold"}}>To Communicate with You</p>
                            <ul>
                                <li>Send you updates, alerts, and other information related to your
volunteer activities and the ALP community.</li>
                                <li>Respond to your inquiries and provide support.</li>
                            </ul>
                            </li>
                        </ol>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Sharing Your Information</p>
                        <br></br>
                        <p>We may share your information with:</p>
                        <br></br>
                        <ul>
                            <li><span style={{fontWeight:"bold"}}>Other Volunteers: </span>Your name, organization, city, state, interests, and profile
picture will be visible to other volunteers within the Portal to facilitate
connections and collaboration.</li>
                            <li><span style={{fontWeight:"bold"}}>Service Providers: </span>Third-party service providers who assist us in operating
the Portal and providing our services, subject to confidentiality agreements.</li>
                            <li><span style={{fontWeight:"bold"}}>Legal Requirements: </span>When required to do so by law, or in response to legal
requests, subpoenas, or court orders.</li>
                        </ul>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Your Choices and Rights</p>
                        <br></br>
                        <ul>
                            <li><span style={{fontWeight:"bold"}}>Profile Information: </span>You can review and update your profile information at
any time through the Portal settings.</li>
                            <li><span style={{fontWeight:"bold"}}>Communication Preferences: </span>You can opt out of receiving non-essential
communications by contacting us directly.</li>
                            
                        </ul>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Data Security</p>
                        <br></br>
                        <p>The Portal may contain links to third-party websites or services. This Privacy Policy
does not apply to those third-party sites. We recommend reviewing the privacy
policies of any third-party sites you visit.</p>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Changes to This Privacy Policy</p>
                        <br></br>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any
changes by posting the new Privacy Policy on the Portal and updating the &quot;Effective
Date&quot; at the top of this page. We encourage you to review this Privacy Policy
periodically to stay informed about how we are protecting your information.</p>
                        <br></br>
                        <p style={{fontWeight:"bold"}}>Contact Us</p>
                        <br></br>
                        <p>If you have any questions or concerns about this Privacy Policy or our data
practices, please contact us at: <span style={{textDecoration:"underline", color:"blue"}}>info@africanlibraryproject.org</span></p>
                        <br></br>
                        <p>Thank you for being a valued member of the ALP volunteer community.</p>
                        <br></br>

                        <Grid item><Button style={styles.btn} variant="contained" onClick={() => { closeModal() }}>I Understand</Button></Grid>
                    </Box>
                </Modal>
            </div>
                
    )

    
}

export default Signup