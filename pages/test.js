import InstructionGroupCard from "../components/steps/InstructionGroup";
import InstructionShipmentCard from "../components/steps/InstructionShipmentCard";
import PageContainer from "../components/PageContainer";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import dbConnect from '../lib/dbConnect'
import getShipmentModel from "../models/Shipment.ts";
import getBookDriveModel from "../models/BookDrive";
import { PostAdd } from "@mui/icons-material";
import { saveNewShipment } from "../db_functions/manageShipments";

function Test(props) {
    const driveName = JSON.parse(props.driveName);
    const driveStatus = JSON.parse(props.driveStatus);
    const driveCode = JSON.parse(props.driveCode);
    const shipmentData = JSON.parse(props.shipmentData);
    console.log("Drive shipment data: ", shipmentData);     // what we want is the .data field from each entry in shipmentData

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
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={true} groupNum={0} header={"Getting Started"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={1} header={"Collecting Books"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={2} header={"Preparing To Ship"}></InstructionGroupCard>
                <InstructionGroupCard driveCode={driveCode} driveStatus={driveStatus} completed={false} groupNum={3} header={"The Finish Line"}></InstructionGroupCard>
                <InstructionShipmentCard driveCode={driveCode} driveStatus={driveStatus} shipmentData={shipmentData} handleSaveShipment={saveNewShipment}></InstructionShipmentCard>
            </Grid>
        </Box>
        </Grid> 
        
    );
}
export default Test

export async function getServerSideProps(context) {
    // write nother async function...

    const getShipmentData = async (ids) => {
        const BASE = "http://localhost:3000/";
        let shipments = [];
        ids.forEach(async (id) => {
            fetch(BASE + `api/shipments/id/${id}`, {
                method: "GET",
            }).then(async (res) => {
                console.log("Response Status: ", res.status);
                const msg = await res.json();
                console.log("jsonified msg: ", msg);
                shipments.push(msg.data);
            });
        }).then(() => {
            console.log("Within function: shipments = ", shipments);
            return shipments;
        });

    }

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

        const ids = driveStatus.finishLine.shipments;
        const BASE = "http://localhost:3000/";
        console.log("Current FL: ", ids);

        let promises = [];
        ids.forEach((id) => {
            promises.push(fetch(BASE + `api/shipments/id/${id}`, {
                method: "GET",
            }))
        })

        const res = await Promise.all(promises);
        let nextPromises = [];
        res.forEach((r) => {
            nextPromises.push(r.json());
        })
        const shipmentData = await Promise.all(nextPromises);
        console.log("Final Shipment Data: ", shipmentData);

        return { props: { driveName: JSON.stringify(driveName), driveCode: JSON.stringify(driveCode), driveStatus: JSON.stringify(driveStatus), shipmentData: JSON.stringify(shipmentData) } }
    } catch (error) {
      console.log(error)
      return {props: {error: JSON.stringify(error)}}
    }
}