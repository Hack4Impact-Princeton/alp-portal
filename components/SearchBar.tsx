import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search'; // Import the Search icon from Material-UI
import { VolunteerAccount } from '../models/VolunteerAccount';
import Link from 'next/link';

const SearchBar: React.FC<{
  users: VolunteerAccount[];
  onQueryChange: (query: string, filteredUsers: VolunteerAccount[]) => void;
  onBackToForum: () => void; // Function to handle the "Back to Forum" button
  minimized: boolean;
}> = ({ users, onQueryChange, onBackToForum, minimized }) => {
  const [query, setQuery] = useState("")
    
  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.fname.toLowerCase().includes(query.toLowerCase()) || user.lname.toLowerCase().includes(query.toLowerCase())
    );
    onQueryChange(query, filteredUsers);
  }, [query]);

const searchBarStyle: React.CSSProperties = {
  position: 'relative', // Changed to relative positioning
  left: minimized ? '10px' : '0px',
  top: minimized ? '10px' : '0px',
  width: minimized ? '800px' :'calc(100% - 20px)',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  outline: 'none',
  marginLeft : minimized ? '0px' : '90px',
};

const forumButtonStyle: React.CSSProperties = {
  position: 'relative', // Changed to relative positioning
  marginLeft: minimized ? '0px' : '90px', // Adjusted left margin instead of left position
  // marginTop: minimized ? '5px' : '55px', // Adjusted top margin instead of top position
  padding: '10px',
  fontSize: '16px',
  outline: 'none',
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

  return (
    <>
    <div style={searchBarStyle}>
      <SearchIcon style ={iconStyle} />
      <input
        style={inputStyle}
        type="text"
        placeholder="Search for users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
    <div style={forumButtonStyle}>
    <Link href="/forum" style={{border:"1px solid gray"}}>
            <div style={{ color: '#FE9834',cursor: 'pointer'}}>
              <span >&lt;</span> Back to Forum
            </div>
      </Link>
    </div>
      
    </>
  );
};

export default SearchBar;
