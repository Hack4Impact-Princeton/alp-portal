import Grid from "@mui/material/Unstable_Grid2";
import DriveCardFront from "./DriveCardFront"
import DriveCardBack from './DriveCardBack'
import { useState } from "react";
export default function DriveCard(props) {
  console.log(props)
  const [showFront, setShowFront] = useState(true)
  return (
    <div className="DashviewDriveCard" style={{
      width: '65vw',
      backgroundColor: '#F5F5F5',
      transition: 'transform 0.6s', // Add a smooth transition to the transform property
      transform: showFront ? "none" : "rotateX(180deg) rotateX(180deg)"
    }}>
      <Grid container spacing={2} sx={{ border: "2px solid black", padding: showFront ? "2rem" : "1rem", backgroundColor: "#F5F5F5" }} >
        {showFront ? <DriveCardFront {...props} flipCard={() => setShowFront(oldVal => !oldVal)} /> : <DriveCardBack {...props} flipCard={() => setShowFront(oldVal => !oldVal)} />}
      </Grid>
    </div>
  );
}
