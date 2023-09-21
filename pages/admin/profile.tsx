
import AdminPageContainer from "../../components/AdminPageContainer";
import { NextPage } from 'next'
function Profile(){
    return (
        <div>
      <AdminPageContainer
      // i forgor how to pass props to here
        fName= "test"
          currPage="profile"
        ></AdminPageContainer>

  </div>
    );
}
export default Profile