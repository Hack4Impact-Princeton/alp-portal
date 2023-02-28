import Box from '@mui/material/Box';
import mongoose from 'mongoose';
import Navbar from '../components/Navbar'
import dbConnect from '../lib/dbConnect'

function DashVolunteer(props) {

    return (
      <div>
        <Navbar></Navbar>
        <Box component="main">
            <div>Welcome to ALP Portal!</div>
            <div>{props.pets}</div>
        </Box>
      </div>
    );
}
  
  /* Keep example code here, nothing should be dynamic on the home page */
  export async function getServerSideProps() {
    await dbConnect()
    const Pet = mongoose.models.Pet
    console.log('Pet' in mongoose.models)
    /* find all the data in our database */
      const result = await Pet.find({})
      const pets = result.map((doc) => {
      const pet = doc.toObject()
      pet._id = pet._id.toString()
      return pet
    })
  
    return { props: { pets: pets} }
  }
  /* end example pet code */
  
export default DashVolunteer