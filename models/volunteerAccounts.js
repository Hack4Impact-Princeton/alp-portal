import mongoose from "mongoose";
const { Schema } = mongoose;

const VolunteerAccountSchema = new Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    alp_id: {
      type: Number,
    },
    ageBucket: {
      type: Number,
    },
    email: {
      type: String,
    },
    pwhash: {
      type: String,
    },
    location: {
      type: Number,
    },
    dateJoined: {
      type: Number,
    },
    allDrives: {
      type: Number,
    },
    badges: {
      type: Number,
    },
  },
  { collection: "volunteerAccounts" }
);

function getVolunteerAccountModel() {
  if ("VolunteerAccount" in mongoose.models)
    return mongoose.models.VolunteerAccount;
  return mongoose.model("VolunteerAccount", VolunteerAccountSchema);
}
export default getVolunteerAccountModel;
