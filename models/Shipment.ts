import mongoose from "mongoose";
import { Schema } from 'mongoose';

export type Shipment = {
    id: number, 
    date: Date,
    organizer: string, 
    driveCode: string,
    trackingCode: string,
    numBoxes: number,
    numBooks: number
}

export const ShipmentSchema = new Schema<Shipment>({
    id: {type: Number},
    date: {type: Date}, 
    organizer: {type: String},
    driveCode: {type: String}, 
    trackingCode: {type: String},
    numBoxes: {type: Number},
    numBooks: {type: Number},
}, 
    { collection : "shipments"}
);

function getShipmentModel() {
    if ("Shipment" in mongoose.models) return mongoose.models.Shipment;
        return mongoose.model("Shipment", ShipmentSchema);
    }
export default getShipmentModel;