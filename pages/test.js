import InstructionGroupCard from "../components/InstructionGroup";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import dbConnect from '../lib/dbConnect'
import getBookDriveModel from "../models/BookDrive";
import InstructionInputCard from "../components/InstructionInputCard";

function Test(props) {
    const driveStatus = JSON.parse(props.driveStatus);
    const driveCode = JSON.parse(props.driveCode);

    return (
        <Grid>
        <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={true} groupNum={0} header={"Getting Started"}></InstructionGroupCard>
        <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={1} header={"Collecting Books"}></InstructionGroupCard>
        <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={2} header={"Preparing To Ship"}></InstructionGroupCard>
        <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={3} header={"The Finish Line"}></InstructionGroupCard>
        </Grid>
    );
}
export default Test

export async function getServerSideProps(context) {
    try {
        await dbConnect()
        const driveCode = "SA3-32";  // constant for now
        const BookDrive = getBookDriveModel();
        const currDrive = await BookDrive.findOne({driveCode: driveCode})
        const driveStatus = {
            gettingStarted: currDrive.gs,
            collectingBooks: currDrive.cb,
            prepareToShip: currDrive.pts,
            finishLine: currDrive.fl,
        }
        return { props: { driveCode: JSON.stringify(driveCode), driveStatus: JSON.stringify(driveStatus) } }
    } catch (error) {
      console.log(error)
      return {props: {error: JSON.stringify(error)}}
    }
}