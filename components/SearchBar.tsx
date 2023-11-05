import React, { useState, useEffect } from 'react';
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

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      <input
        style={{
          width: '300px', // Adjust the width as needed
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          outline: 'none',
        }}
        type="text"
        placeholder="Search for users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
