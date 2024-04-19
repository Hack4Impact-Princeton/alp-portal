import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search'; // Import the Search icon from Material-UI
import { VolunteerAccount } from '../../models/VolunteerAccount';
import Link from 'next/link';
import { AdminAccount } from '../../models/AdminAccount';
import { IconButton, Grid, Modal, Popover, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import addNewAdmin from '../../db_functions/adminFns';
import { Admin } from 'mongodb';

const PromoteAdminSearchBar: React.FC<{
  users: VolunteerAccount[];
  admins: AdminAccount[];
  //onBackToForum: () => void; // Function to handle the "Back to Forum" button

}> = ({ users, admins }) => {
  const [query, setQuery] = useState("")
  const [filteredVolunteers, setFilteredVolunteers] = useState(users)

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.fname.toLowerCase().includes(query.toLowerCase()) || user.lname.toLowerCase().includes(query.toLowerCase())
    );
    handleQueryChange( query,filteredUsers);
  }, [query]);

  const handleQueryChange = (query: string, filteredUsers: VolunteerAccount[]) => {
    if (query.trim() === '') {
      setFilteredVolunteers([]); // If the query is empty, set filteredProfiles to an empty array
    } else {
      setFilteredVolunteers(filteredUsers);

    }

  };
  const [showModal, setShowModal] = useState(false)
  const [adminSelected, setAdminSelect] = useState<VolunteerAccount>()
  

  
const searchBarStyle: React.CSSProperties = {
  position: 'relative', // Changed to relative positioning
 left:  '0px',
    top:  '0px',
  width:'calc(100%-20px)',
 // width: minimized ? '800px' :'calc(100% - 20px)',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  outline: 'none',
 // marginLeft: '4vw'
  //marginLeft : minimized ? '0px' : '60px',
};


  const inputStyle:  React.CSSProperties = {
    width: '100%', // Adjust the width as needed
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    paddingLeft: '40px', // To make space for the icon
  };

  const iconStyle:  React.CSSProperties = {
    position: 'absolute',
    left: '10px', // Adjust the left position to your preference
    top: '50%', // Center vertically
    transform: 'translateY(-50%)',
    color: '#888', // Icon color
  };
  const [adminNotif, setAdminNotif] = useState("")
  const handleAddAdmin = async (adminSelected: VolunteerAccount) => {
    try {
        
        const addAdminRes = await addNewAdmin(adminSelected)

        if (!addAdminRes.success) {
          alert(addAdminRes.error.message);
          return;
        }
        setAdminNotif(' successfully added as admin');
        setTimeout(() => {
        }, 2000);
      } catch (e: Error | any) {
        console.error(e);
      }

  } 

  return (
    <div >
    <div style={searchBarStyle}>
      <SearchIcon style ={iconStyle} />
      <input
        style={inputStyle}
        type="text"
        placeholder="Search for volunteers"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
    <Grid container display={'flex'} flexDirection={'column'} sx={{maxHeight:"300px",  overflowY:"scroll", flexWrap:"nowrap"}}>
     {filteredVolunteers.map((profile) => (
        <div>
        <Grid item border={'1.5 solid black'} height={40} width={"100%"} sx={{border:"1.5px solid grey"}} display={'flex'} alignItems={"center"}>
            <IconButton onClick={()=>{setAdminSelect(profile); setShowModal(true)}}size={'small'}><AddCircleIcon/></IconButton>
            <p>{profile.fname} {profile.lname} | {profile.email}</p>
        </Grid>
        
        </div>
      ))}
    </Grid>
    <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", padding: "20px", width: "30vw", minHeight:"10vh" }}>
               { adminSelected && 
               <Grid>
                <p>Are you sure you want to promote {adminSelected.fname} {adminSelected.lname} to admin?</p> 
                <Grid>
                    <Button onClick={() => handleAddAdmin(adminSelected)}>Yes</Button>
                    <Button onClick={()=>setShowModal(false)}>No </Button>
                </Grid>
                {adminNotif && <p>{adminNotif}</p>}
               </Grid>
               }
            </div>
        </Modal>
    </div>
  );
};

export default PromoteAdminSearchBar;
