import getVolunteerAccountModel from "../../models/VolunteerAccount"
import dbConnect from '../../lib/dbConnect'
import Router from 'next/router'
import {getStates} from '../../lib/enums'

const Profile = (props) => {
  const states = getStates()
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