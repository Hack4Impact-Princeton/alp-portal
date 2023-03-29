import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from '../models/BookDrive';

function DashVolunteer(props) {
  // parse stringified json
  let drives = JSON.parse(props.drives)
  console.log(drives)
  return (
    <div>
      <Navbar></Navbar>
      <Box component="main">
        <div>Welcome to ALP Portal!</div>
        <div>{props.drives}</div> 
      </Box>
    </div>
  );
}
  
export async function getServerSideProps() {
  await dbConnect()
  const BookDrive = getBookDriveModel();
  /* find all the data in our database */
  const drives = await BookDrive.find({})
  // stringify data before sending
  return { props: { drives: JSON.stringify(drives) } }
}
  /* Keep example code here, nothing should be dynamic on the home page */
//   export async function getServerSideProps() {
//     await dbConnect()
  
//     /* find all the data in our database */
//     const result = await Pet.find({})
//     const pets = result.map((doc) => {
//       const pet = doc.toObject()
//       pet._id = pet._id.toString()
//       return pet
//     })
  
//     return { props: { pets: pets } }
//   }
  /* end example pet code */
  
export default DashVolunteer