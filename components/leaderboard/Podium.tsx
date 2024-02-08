import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Grid2 from "@mui/material/Unstable_Grid2";
import CircleIcon from "@mui/icons-material/Circle";
import { first } from "cypress/types/lodash";
import {Typography} from '@mui/material'


type dataType = {
  userName: string;
  userState: string;
  totalDrives: number;
  seasonalDrives: number;
};
type PodiumProps = {
  data: dataType[];
  boardType: string;
};

const Podium: React.FC<PodiumProps> = ({ data, boardType }) => {
  const firstPlace = data == null ? null : data[0];
  const secondPlace = data == null ? null : data[1];
  const thirdPlace = data == null ? null : data[2];
  return (
    <Grid2
      container
      display={"flex"}
      flexDirection={"column"}
      sx={{ backgroundColor: "#F1F1F1" }}
      justifyContent={"space-evenly"}
      paddingBottom={2}
      border={2}
      borderRadius={1}
      borderColor={"#C9C9C9"}
    >
      <Grid2
        container
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        marginTop={-5}

      >
        <Grid2 paddingTop={1}>
          <Typography
            sx={{
              position: "relative",
              top: 30,
              left: 2,
              color: "orange",
              zIndex: 1,
              fontSize: { xs: '18px', md: '20px', lg: '30px' } ,
            }}
          >
            2
          </Typography>
          <AccountCircleIcon sx={{ fontSize: "5vw" }} />
        </Grid2>
        <Grid2>
        <Typography
            sx={{
              position: "relative",
              top: 50,
              left: 2,
              color: "orange",
              zIndex: 1,
              fontStyle: "bold",
              fontSize: { xs: '22px', md: '32px', lg: '40px' } ,
            }}
          >
            1
          </Typography>
          <AccountCircleIcon sx={{ fontSize: "7vw" }} />
        </Grid2>
        <Grid2 paddingTop={1}>
        <Typography
            sx={{
              position: "relative",
              top: 30,
              left: 2,
              color: "orange",
              zIndex: 1,
              fontSize: { xs: '18px', md: '20px', lg: '30px' } ,
            }}
          >
            3
          </Typography>
          <AccountCircleIcon sx={{ fontSize: "5vw" }} />
        </Grid2>
      </Grid2>

      <Grid2
        container
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        marginTop={1}
      >
        <Grid2
          minWidth={"27%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          {secondPlace ? (
            <div style={{ textAlign: "center" }}>
              <p>{secondPlace.userName}</p>
              <p>{secondPlace.userState}</p>
              <p>
                Drives:
                {boardType == "seasonal"
                  ? secondPlace.seasonalDrives
                  : secondPlace.totalDrives}
              </p>
            </div>
          ) : (
            <p>Second Place</p>
          )}
        </Grid2>
        <Grid2
          minWidth={"27%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          {firstPlace ? (
            <div style={{ textAlign: "center" }}>
              <p>{firstPlace.userName}</p>
              <p>{firstPlace.userState}</p>
              <p>
                Drives:
                {boardType == "seasonal"
                  ? firstPlace.seasonalDrives
                  : firstPlace.totalDrives}
              </p>
            </div>
          ) : (
            <p>First Place</p>
          )}
        </Grid2>
        <Grid2
          minWidth={"27%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          {thirdPlace ? (
            <div style={{ textAlign: "center" }}>
              <p>{thirdPlace.userName}</p>
              <p>{thirdPlace.userState}</p>
              <p>
                Drives:
                {boardType == "seasonal"
                  ? thirdPlace.seasonalDrives
                  : thirdPlace.totalDrives}
              </p>
            </div>
          ) : (
            <p>Third Place</p>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
export default Podium;
