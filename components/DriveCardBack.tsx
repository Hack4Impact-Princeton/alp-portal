import { BookDrive } from "../models/BookDrive";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularIIcon from "./CircularIIcon";
const DriveCardBack: React.FC<{ drive: BookDrive, flipCard: () => void }> = ({ drive, flipCard }) => {
    const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat."
    return (
        <>
            <Box sx={{ flexGrow: 1, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                <Grid sx={{margin: 1.4}}>
                    < h2 style={{ textAlign: "left", marginBottom: 3, color: "#5F5F5F" }}>Organization Info</h2>
                    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <p style={{color: "#5F5F5F"}}>{loremIpsum}</p>
                        <Grid sx={{ display: "flex", alignItems: "flex-end" }}>
                            <CircularIIcon flipCard={flipCard} />
                        </Grid>
                    </Grid >
                </Grid>
            </Box >
        </>
    )
}
export default DriveCardBack