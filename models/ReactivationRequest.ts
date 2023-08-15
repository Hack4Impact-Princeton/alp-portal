import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export type ReactivationRequest = {
    id: string, 
    date: Date,
    volunteerId: number, 
    driveCode: string,
    status: string,
    message: string,
}

export const ReactivationRequestSchema = new Schema<ReactivationRequest>({
    id: {type: String, required: true},
    date: {type: Date, required: true}, 
    volunteerId: {type: Number, required: true},
    driveCode: {type: String, required: true}, 
    message: {type: String, required: true}

}, 
    { collection : "reactivationRequests"}
);

function getReactivationRequestModel() {
    if (mongoose.models != undefined && "ReactivationRequest" in mongoose.models) return mongoose.models.ReactivationRequest;
    const model = mongoose.model("ReactivationRequest", ReactivationRequestSchema);
    return model;
}
export default getReactivationRequestModel;