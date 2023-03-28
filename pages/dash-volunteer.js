import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import dbConnect from "../lib/dbConnect";
import getVolunteerAccountModel from "../models/volunteerAccounts";
function DashVolunteer(props) {
  // parse stringified json
  let drives = JSON.parse(props.drives);
  console.log(drives);
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

export default DashVolunteer;
