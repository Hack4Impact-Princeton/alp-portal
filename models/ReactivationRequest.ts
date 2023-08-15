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
    id: {type: String},
    date: {type: Date}, 
    volunteerId: {type: Number},
    driveCode: {type: String}, 

}, 
    { collection : "reactivationRequests"}
);

function getReactivationRequestModel() {
    if (mongoose.models != undefined && "ReactivationRequest" in mongoose.models) return mongoose.models.ReactivationRequest;
    const model = mongoose.model("ReactivationRequest", ReactivationRequestSchema);
    return model;
}
export default getReactivationRequestModel;