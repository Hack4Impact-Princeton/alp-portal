import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export type Shipment = {
    id: number, 
    date: Date,
    organizer: string, 
    driveCode: string,
    trackingCode: string,
    numBoxes: number,
    numBooks: number,
    isFinal: boolean,
    received: boolean,
}

export const ShipmentSchema = new Schema<Shipment>({
    id: {type: Number},
    date: {type: Date}, 
    organizer: {type: String},
    driveCode: {type: String}, 
    trackingCode: {type: String},
    numBoxes: {type: Number},
    numBooks: {type: Number},
    isFinal: {type: Boolean},
    received: {type: Boolean},
}, 
    { collection : "shipments"}
);

function getShipmentModel() {
    console.log("models: ", mongoose.models);
    if (mongoose.models != undefined && "Shipment" in mongoose.models) return mongoose.models.Shipment;
    const model = mongoose.model("Shipment", ShipmentSchema);
    console.log("Returning model: ", model);
    return model;
}
export default getShipmentModel;