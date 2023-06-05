import getVolunteerAccountModel from "../../models/VolunteerAccount"
import dbConnect from '../../lib/dbConnect'
import Router from 'next/router'
const Profile = (props) => {
  const states = [
    {
        name: "Alabama",
        index: 1,
    },
    {
        name: "Alaska",
        index: 2,
    },
    {
        name: "Arizona",
        index: 3,
    },
    {
        name: "Arkansas",
        index: 4,
    },
    {
        name: "California",
        index: 5,
    },
    {
        name: "Colorado",
        index: 6,
    },
    {
        name: "Connecticut",
        index: 7,
    },
    {
        name: "Delaware",
        index: 8,
    },
    {
        name: "Florida",
        index: 9,
    },
    {
        name: "Georgia",
        index: 10,
    },
    {
        name: "Hawaii",
        index: 11,
    },
    {
        name: "Idaho",
        index: 12,
    },
    {
        name: "Illinois",
        index: 13,
    },
    {
        name: "Indiana",
        index: 14,
    },
    {
        name: "Iowa",
        index: 15,
    },
    {
        name: "Kansas",
        index: 16,
    },
    {
        name: "Kentucky",
        index: 17,
    },
    {
        name: "Louisiana",
        index: 18,
    },
    {
        name: "Maine",
        index: 19,
    },
    {
        name: "Maryland",
        index: 20,
    },
    {
        name: "Massachusetts",
        index: 21,
    },
    {
        name: "Michigan",
        index: 22,
    },
    {
        name: "Minnesota",
        index: 23,
    },
    {
        name: "Mississippi",
        index: 24,
    },
    {
        name: "Missouri",
        index: 25,
    },
    {
        name: "Montana",
        index: 26,
    },
    {
        name: "Nebraska",
        index: 27,
    },
    {
        name: "Nevada",
        index: 28,
    },
    {
        name: "New Hampshire",
        index: 29,
    },
    {
        name: "New Jersey",
        index: 30,
    },
    {
        name: "New Mexico",
        index: 31,
    },
    {
        name: "New York",
        index: 32,
    },
    {
        name: "North Carolina",
        index: 33,
    },
    {
        name: "North Dakota",
        index: 34,
    },
    {
        name: "Ohio",
        index: 35,
    },
    {
        name: "Oklahoma",
        index: 36,
    },
    {
        name: "Oregon",
        index: 37,
    },
    {
        name: "Pennslyvania",
        index: 38,
    },
    {
        name: "Rhode Island",
        index: 39,
    },
    {
        name: "South Carolina",
        index: 40,
    },
    {
        name: "South Dakota",
        index: 41,
    },
    {
        name: "Tennessee",
        index: 42,
    },
    {
        name: "Texas",
        index: 43,
    },
    {
        name: "Utah",
        index: 44,
    },
    {
        name: "Vermont",
        index: 45,
    },
    {
        name: "Virginia",
        index: 46,
    },
    {
        name: "Washington",
        index: 47,
    },
    {
        name: "West Virginia",
        index: 48,
    },
    {
        name: "Wisconsin",
        index: 49,
    },
    {
        name: "Wyoming",
        index: 50,
    }
]
  let account = JSON.parse(props.account)
  const goBack = () => {
    const href = `/dash-volunteer?alp_id=${account.alp_id}`
    Router.push(href)
  }
  const edit = () => {
    const href= `/volunteeraccounts/edit?alp_id=${account.alp_id}`
    Router.push(href)
  }
    return (
      <div>
        <br></br>
        <p>first name: {account.fname}</p>
        <br/>
        <p>last name: {account.lname}</p>
        <br></br>
        <p>
          email: {account.email}
        </p>
        <br></br>
        <p>
          location: {states[account.location-1].name}
        </p>
        <br></br>
        <p>
          number of drives: {account.allDrives}
        </p>
        <br></br>
        <button onClick={goBack}>Click to return to the dash volunteer page</button>
        <button onClick={edit}>Click here to modify your information</button>
      </div>
    )
}

export const getServerSideProps = async(context) => {
  await dbConnect()
  const VolunteerAccount = getVolunteerAccountModel()
  const alp_id = context.query.alp_id
  const volunteerAccount = await VolunteerAccount.findOne({alp_id: alp_id})
  return {props: {account: JSON.stringify(volunteerAccount)}}
}
  
export default Profile