// import fetch from "node-fetch";
// import mongoose from 'mongoose';
// import dbConnect from "../lib/dbConnect.js";
// import getShipmentModel from "../models/Shipment";

// const BASE = "http://localhost:3000/";

export async function saveNewShipment(driveCode, driveStatus, date, tracking, numBooks, numBoxes) {
    console.log("Drive Status: ", driveStatus);
    // const Shipment = getShipmentModel();
    const shipmentData = {
        date: date,
        organizer: "placeholder@test.com",
        driveCode: driveCode,
        trackingCode: (tracking == "") ? "" : tracking,
        numBoxes: numBoxes,
        numBooks: numBooks,
        isFinal: false,
        isReceived: false,
    } 
    const res = await fetch(`api/shipments/id/${0}`, {   // nonsense id number
        method: "POST",
        body: JSON.stringify(shipmentData),
    })
    console.log("Response Status ", res.status);
    const msg = await res.json();
    const newId = msg.id;
    console.log(newId);

    const new_fl = {
        fl: {
            isFinalized: driveStatus.finishLine.isFinalized,
            shipments: [...driveStatus.finishLine.shipments, msg.id],
        }
    }
    const second_res = await fetch(`/api/bookDrive/${driveCode}`, {
        method: "PUT",
        body: JSON.stringify(new_fl),
    })
    console.log("Response Status: ", second_res.status);

    return shipmentData;
}

export async function receiveShipment(shipmentId) {
    
}

export async function finalizeDrive(driveCode) {

}