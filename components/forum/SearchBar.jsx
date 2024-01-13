import { useRef, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { useRouter } from 'next/router'
import useDynamicPadding from "../../lib/useDynamicPadding";
import useClickOutside from "../../lib/useClickOutside";
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

const data = [
  "Paris",
  "London",
  "New York",
  "Tokyo",
  "Berlin",
  "Buenos Aires",
  "Cairo",
  "Canberra",
  "Rio de Janeiro",
  "Dublin",
];

const Bar = ({ searchQuery, setSearchQuery }) => {
  const router = useRouter()
  const handleKeyPress = (event) => {
    console.log("helloo")
    if (event.key === 'Enter' && searchQuery !== '') {
      console.log("we did it")
      // console.log(router.pathName)
      router.push(`/profile_search?searchQuery=${searchQuery}`, "/profile_search")
    }
  }

  return (
    // <form>
    <TextField
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
        width: "40vw", backgroundColor: "#F5F5F5"
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
    // </form>
  );
}
const SearchBar = ({ allAccounts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAccounts = filterData(searchQuery, allAccounts) ? filterData(searchQuery, allAccounts) : [];
  const [isHovered, setHovered] = useState(Array(filteredAccounts.length).fill(false))

  const searchResultsRef = useRef(null)
  const handleClickOutside = () => {
    setSearchQuery("")
  }
  useClickOutside(searchResultsRef, handleClickOutside)

  useEffect(() => {
    setHovered(Array(filteredAccounts.length).fill(false))
  }, [searchQuery])
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
      <div ref={searchResultsRef} style={{ position: "absolute", top: 162, left: useDynamicPadding(635, 775, "29vw", "20vw", "15vw"), paddingBottom: 3, maxHeight: "12.5vw", zIndex: 1000 , backgroundColor: "white", overflowY: "auto", width: "40.2vw", borderBottom: "5px solid white" }}>
        {searchQuery &&
          filteredAccounts.map((d, index) => (
            <div
              className="text"
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                justifyContent: "normal",
                fontSize: 20,
                color: "black",
                margin: 1,
                width: "99%",
                border: "1.95px solid #F5F5F5",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: isHovered[index] ? "#F5F5F5" : "white"
              }}
              key={d.id}
              onMouseEnter={() => setHovered((prev) => {
                prev[index] = true
                return [...prev]
              })}
              onMouseLeave={() => setHovered((prev) => {
                prev[index] = false
                return [...prev]
              })}
            >
              <img style={{ height: 25, marginLeft: 15 }} src={d.pfpLink ? d.pfpLink : "https://res.cloudinary.com/alp-portal/image/upload/c_thumb,g_face,h_150,w_150/rzjgu7qrlfhgefei5v4g"} />
              <p style={{ marginLeft: 18 }}>
                {`${d.fname} ${d.lname}`}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
export default SearchBar;
