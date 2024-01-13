import { useRef, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { useRouter } from 'next/router'

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d.toLowerCase().includes(query));
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
      sx={{ width: "40vw" }}
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
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, data);

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
      <div style={{ padding: 3 }}>
        {searchQuery &&
          dataFiltered.map((d) => (
            <div
              className="text"
              style={{
                padding: 5,
                justifyContent: "normal",
                fontSize: 20,
                color: "blue",
                margin: 1,
                width: "250px",
                BorderColor: "green",
                borderWidth: "10px",
              }}
              key={d.id}
            >
              {d}
            </div>
          ))}
      </div>
    </div>
  );
};
export default SearchBar;
