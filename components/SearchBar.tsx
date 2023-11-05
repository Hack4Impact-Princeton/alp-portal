import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search'; // Import the Search icon from Material-UI
import { VolunteerAccount } from '../models/VolunteerAccount';

const SearchBar: React.FC<{
  users: VolunteerAccount[];
  onQueryChange: (query: string, filteredUsers: VolunteerAccount[]) => void;
}> = ({ users, onQueryChange }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.fname.toLowerCase().includes(query.toLowerCase()) || user.lname.toLowerCase().includes(query.toLowerCase())
    );
    onQueryChange(query, filteredUsers);
  }, [query]);

  const searchBarStyle = {
    position: 'absolute',
    left: '250px', // Adjust the right position as needed
    top: '200px', // Adjust the top position as needed
    width: '300px', // Adjust the width as needed
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
  };

  const inputStyle = {
    width: '100%', // Adjust the width as needed
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    paddingLeft: '40px', // To make space for the icon
  };

  const iconStyle = {
    position: 'absolute',
    left: '10px', // Adjust the left position to your preference
    top: '50%', // Center vertically
    transform: 'translateY(-50%)',
    color: '#888', // Icon color
  };

  return (
    <div style={searchBarStyle}>
      <SearchIcon style={iconStyle} /> {/* Add the Search icon */}
      <input
        style={inputStyle}
        type="text"
        placeholder="Search for users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
