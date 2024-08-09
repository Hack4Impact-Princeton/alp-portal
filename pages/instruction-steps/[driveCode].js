import InstructionGroupCard from "../../components/steps/InstructionGroup";
import PageContainer from "../../components/PageContainer";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import dbConnect from '../../lib/dbConnect'
import getShipmentModel from "../../models/Shipment";
import getBookDriveModel from "../../models/BookDrive";
// import { ConnectingAirportsOutlined, PostAdd } from "@mui/icons-material";
import { saveNewShipment } from "../../db_functions/manageShipments";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from '../api/auth/[...nextauth]'
import getVolunteerAccountModel from "../../models/VolunteerAccount";
function InstructionSteps(props) {
    // const driveName = JSON.parse(props.driveName);
    console.log(props.error)
    if (props.error) return (<div key={"hi"}><p>{`Something went wrong... ${props.error}`}</p><Link href="/dash-volunteer">Click to return to volunteer dashboard</Link></div>)
    const driveStatus = JSON.parse(props.driveStatus);
    const driveCode = JSON.parse(props.driveCode);
    let shipments = JSON.parse(props.shipments);
    shipments.forEach(shipment => shipment.date = new Date(shipment.date))

    console.log("Drive shipment data: ", shipments);     // what we want is the .data field from each entry in shipmentData

    return (
        <Grid>
            <PageContainer fName="Organizer" currPage="instruction-steps"></PageContainer>
            <Box display="flex" flexDirection="column" sx={{
                pl: "15vw",
                pt: "5vh",
                pr: "5vw",
                width: '100%',
                justifyContent: "space-between"
                }}>
                <Grid>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={true} groupNum={0} header={"Getting Started"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={1} header={"Collecting Books"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={2} header={"Preparing To Ship"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} shipments={shipments} handleSaveShipment={saveNewShipment} groupNum={3} header={"The Finish Line"}></InstructionGroupCard>
            </Grid>
        </Box>
        </Grid> 
        
    );
}
export default InstructionSteps

export async function getServerSideProps(context) {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return {
              redirect: {
                destination: '/auth/login',
                permanent: false
              }
            }
          }
        const driveCode = context.query.driveCode
        await dbConnect()
        const BookDrive = getBookDriveModel();
        const currDrive = await BookDrive.findOne({driveCode: driveCode})
        if (!currDrive) throw new Error(`no bookdrive found with code ${driveCode}`)
        const VolunteerModel = getVolunteerAccountModel()
        const volunteer = await VolunteerModel.findOne({email: session.user.email})
        console.log("organizer: ", currDrive.organizer);
        const currUser = `${volunteer.fname} ${volunteer.lname}`;
        console.log("curr user: ", currUser);
        // hardcode two test accounts to be able to see all drives
        if ((currUser !== 'test1 test1' && currUser !== 'Ivy Wang') && currUser!== currDrive.organizer) throw new Error("Unauthorized attempt to access bookdrive - you do not have the permission to view this bookdrive")
        const driveName = currDrive.driveName;
        const driveStatus = {
            gettingStarted: currDrive.gs,
            collectingBooks: currDrive.cb,
            prepareToShip: currDrive.pts,
            finishLine: currDrive.fl,
        }
        const ids = driveStatus.finishLine.shipments;
        const Shipment = getShipmentModel()
        const promises = ids.map(async (id) => await Shipment.findById(id))
        const shipments = await Promise.all(promises)
        return { props: { driveName: JSON.stringify(driveName), driveCode: JSON.stringify(driveCode), driveStatus: JSON.stringify(driveStatus), shipments: JSON.stringify(shipments) } }
    } catch (error) {
      console.log(error)
      console.log(error.message)
      return {props: {error: error.message}}
    }
}