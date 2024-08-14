import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../models/VolunteerAccount";
import mongoose from "mongoose";
import Navbar from "../components/Navbar";
import SearchBar from "../components/forum/SearchBar";
import Box from "@mui/material/Box";
import PageContainer from "../components/PageContainer";
import DriveCard from "../components/DriveCard";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import useDynamicPadding from "../lib/useDynamicPadding";
import React, { useState, ChangeEvent } from "react";
import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";

type volAccountProps = {
  allAccounts: VolunteerAccount[];
};

const Search: NextPage<volAccountProps> = ({ allAccounts}) => {
  const [searchValue, setSearchValue] = useState(""); // Initialize the state variable with an empty string
  const [filteredAccounts, setFilteredAccounts] = useState<
    Record<string, VolunteerAccount>
  >({});

  const fullNameArray = allAccounts.map(
    (account) => `${account.fname} ${account.lname}`
  );

  const fullNameMap = allAccounts.reduce(
    (map: Record<string, VolunteerAccount>, account) => {
      const fullName = `${account.fname} ${account.lname}`;
      map[fullName] = account;
      return map;
    },
    {}
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update the searchValue state with the input value
    const fullNamesArray = Object.keys(fullNameMap);

    // Filter the array of full names based on the search value
    const filteredNames = fullNamesArray.filter((fullName) =>
      fullName.toLowerCase().includes(event.target.value.toLowerCase())
    );

    // Create a new filtered map based on the filtered names
    const filteredAccountsMap = filteredNames.reduce(
      (map: Record<string, VolunteerAccount>, fullName) => {
        map[fullName] = fullNameMap[fullName];
        return map;
      },
      {}
    );

    setFilteredAccounts(filteredAccountsMap);
  };

  const renderAccountDetails = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ALP ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredAccounts).map(([name, details]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{details.alp_id}</td>
              <td>{details.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchValue} // Bind the value of the input to the searchValue state
        onChange={handleInputChange} // Call the handler function when the input value changes
      />
      <button onClick={() => console.log(searchValue)}>Search</button>
      <div>
        <h2>Filtered Account Details</h2>
        {renderAccountDetails()}
      </div>
    </div>
  );
};

export default Search;

export const getServerSideProps = async (context: any) => {
  try {
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();

    const allAccounts = (await VolunteerAccount.find({})) as VolunteerAccount[];

    return {
      props: {
        allAccounts: JSON.parse(JSON.stringify(allAccounts)),
      },
    };
  } catch (e: Error | any) {
    const errorStr =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;
    return {
      props: { error: errorStr },
    };
  }
};
