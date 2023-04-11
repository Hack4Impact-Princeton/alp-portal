import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import InstructionStepCard from "../components/InstructionStepCard";
// import dbConnect from '../lib/dbConnect'

function DashVolunteer() {
  const submitBtn = <button>test</button>;
  return (
    <div>
      <Navbar></Navbar>
      <Box component="main">
        <div>Welcome to ALP Portal!</div>
      </Box>
      <div style={{ "margin-top": "10px" }}></div>
      <InstructionStepCard
        heading="International Shipping Fee ($250)"
        subHeading="Send to ALP team — more info"
        submitBtn={submitBtn}
      />
    </div>
  );
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

export default DashVolunteer;
