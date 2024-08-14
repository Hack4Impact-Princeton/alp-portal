import { useRef, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter } from 'next/router'
import useClickOutside from "../../lib/useClickOutside";
import { styled } from '@mui/material/styles';

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => {
      const userName = `${d.fname} ${d.lname}`
      return userName.toLowerCase().includes(query)
    })
      ;
  }
};

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input::placeholder': {
    fontFamily: "Epilogue",    
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white', // Default border color
    },
    '&:hover fieldset': {
      borderColor: '#5F5F5F', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5F5F5F', // Border color when focused
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Epilogue',   // Change font family

  },
  
  fontSize: "16px",
  color: "black",
  backgroundColor: "white",
  padding: "8px",
  // Add other custom styles here
});

const Bar = ({ searchQuery, setSearchQuery }) => {
  const router = useRouter()
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery !== '') {
      router.push(`/profile_search?searchQuery=${searchQuery}`, "/profile_search")
    }
  }

  return (
    <CustomTextField
      onKeyDown={handleKeyPress}
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      variant="outlined"
      placeholder="Search for a profile..."
      size="small"
      sx={{
        width: "40vw", backgroundColor: "#F5F5F5", fontFamily:"Epilogue"
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton type="submit" aria-label="search" onClick={() => router.push(`/profile_search?searchQuery=${searchQuery}`, "/profile_search")}>
              <SearchIcon style={{ fill: "gray" }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}



const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchResultsRef = useRef(null)
  const handleClickOutside = () => {
    setSearchQuery("")
  }
  useClickOutside(searchResultsRef, handleClickOutside)
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        
      }}
    >
      <Bar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};
export default SearchBar;
