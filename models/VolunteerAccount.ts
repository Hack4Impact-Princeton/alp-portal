import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

type BadgeInfoProps = {
  isEarned: boolean;
  level: number;
  name: string;
  description: string;
};

export type VolunteerAccount = {
  fname: string;
  lname: string;
  alp_id: number;
  ageBucket: number;
  email: string;
  pwhash: string;
  location: number;
  startDate: String;
  allDrives: number;
  driveIds: Types.Array<string>;
  friends: string[];
  badges: BadgeInfoProps[];
  broadcasts: string[];
  chatIds: string[];
  friendRequests: string[];
};

export const VolunteerAccountSchema = new Schema<VolunteerAccount>(
  {
    fname: {
      type: String,
      required: true,
      default: "default_fname",
    },
    lname: {
      type: String,
      required: true,
      default: "default_lname",
    },
    alp_id: {
      type: Number,
      required: true,
    },
    ageBucket: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pwhash: {
      type: String,
      required: true,
    },
    location: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    allDrives: {
      type: Number,
      required: true,
    },
    driveIds: [String],
    friends: [String],
    badges: {
      type: [Object], // Use [Object] to indicate an array of objects
      required: true,
      default: [],
    },
    broadcasts: {
      type: [String],
    },
    chatIds: {
      type: [String],
    },
    friendRequests: {
      type: [String],
    },
  },
  { collection: "volunteerAccounts" }
);

function getVolunteerAccountModel() {
  if ("VolunteerAccount" in mongoose.models) {
    return mongoose.models.VolunteerAccount;
  }
  return mongoose.model("VolunteerAccount", VolunteerAccountSchema);
}
export default getVolunteerAccountModel;
