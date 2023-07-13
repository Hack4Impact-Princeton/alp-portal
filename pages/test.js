import InstructionGroupCard from "../components/steps/InstructionGroup";
import PageContainer from "../components/PageContainer";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from "../models/BookDrive";

function Test(props) {
    const driveName = JSON.parse(props.driveName);
    const driveStatus = JSON.parse(props.driveStatus);
    const driveCode = JSON.parse(props.driveCode);
    const booksGoal = JSON.parse(props.booksGoal)

    return (
        <Grid>
            <PageContainer fName="Ivy" currPage="test"></PageContainer>
            <Box display="flex" flexDirection="column" sx={{
                pl: 20,
                pt: 5,
                pr: 5,
                width: '100%',
                justifyContent: "space-between"
                }}>
                <Grid>
                <InstructionGroupCard booksgoal={booksGoal} driveCode={driveCode} driveStatus={driveStatus} groupNum={0} header={"Getting Started"}></InstructionGroupCard>
                <InstructionGroupCard booksGoal={booksGoal} driveCode={driveCode} driveStatus={driveStatus} groupNum={1} header={"Collecting Books"}></InstructionGroupCard>
                <InstructionGroupCard booksGoal={booksGoal} driveCode={driveCode} driveStatus={driveStatus} groupNum={2} header={"Preparing To Ship"}></InstructionGroupCard>
                <InstructionGroupCard booksGoal={booksGoal} driveCode={driveCode} driveStatus={driveStatus} groupNum={3} header={"The Finish Line"}></InstructionGroupCard>
            </Grid>
        </Box>
        </Grid> 
        
    );
}
export default Test

export async function getServerSideProps(context) {
    try {
        await dbConnect()
        const driveCode = "M15-32";  // constant for now
        const BookDrive = getBookDriveModel();
        const currDrive = await BookDrive.findOne({driveCode: driveCode})
        const driveName = currDrive.driveName;
        const driveStatus = {
            gettingStarted: currDrive.gs,
            collectingBooks: currDrive.cb,
            prepareToShip: currDrive.pts,
            finishLine: currDrive.fl,
        }

        return { props: { driveName: JSON.stringify(driveName), driveCode: JSON.stringify(driveCode), driveStatus: JSON.stringify(driveStatus), booksGoal: JSON.stringify(currDrive.booksGoal) } }
    } catch (error) {
      console.log(error)
      return {props: {error: JSON.stringify(error)}}
    }
}