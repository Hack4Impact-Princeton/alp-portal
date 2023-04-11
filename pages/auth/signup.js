import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { ClientRequest } from 'http';

const Signup = () => {
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

export default Signup
