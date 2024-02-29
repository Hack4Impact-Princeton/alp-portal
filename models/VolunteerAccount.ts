import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

type BadgeInfoProps = {
  badgeID: number;
  level: number;
};

export type BadgeType = {
  Organizer: number, Profile: number, Connector: number, Supporter: number, Leader: number, Participation: number
}

export type VolunteerAccount = {
    fname: string,
    lname: string,
    alp_id: number,
    ageBucket: number,
    email: string,
    pwhash: string,
    country: number,
    state: number,
    city: number,
    startDate: String,
    allDrives: number,
    driveIds: Types.Array<string>,
    friends: string[],
    badges: BadgeType;
    broadcasts: string[],
    chatIds: string[],
    pfpLink: string,
    friendRequests: string[],
    affiliation: string,
    hobbies: string[],
    favoriteBook: string,
    commentsPosted: number,
    commentsReceived: number,
    postIDs: string[]
}


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
    country: {
      type: Number,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    city: {
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
      Organizer: {
        type : Number,
        default: 0
      }, 
      Profile: {
        type : Number,
        default: 0
      }, 
      Connector: {
        type : Number,
        default: 0
      },  
      Supporter: {
        type : Number,
        default: 0
      }, 
      Leader: {
        type : Number,
        default: 0
      }, 
      Participation: {
        type : Number,
        default: 0
      }
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
    pfpLink:  {
        type: String,
        default: "https://res.cloudinary.com/alp-portal/image/upload/c_thumb,g_face,h_150,w_150/rzjgu7qrlfhgefei5v4g"
    },
    affiliation: {
      type: String,
      default: ""
    },
    hobbies: {
      type: [String],
      default: []
    },
    favoriteBook: {
      type: String,
      default: ""
    },
    commentsPosted: {
      type: Number,
      required: true,
      default: 0
    },
    commentsReceived: {
      type: Number,
      required: true,
      default: 0
    },
    postIDs: {
      type: [String],
      default: []
    }
}, {collection: 'volunteerAccounts'})


function getVolunteerAccountModel() {
  if ("VolunteerAccount" in mongoose.models) {
    return mongoose.models.VolunteerAccount;
  }
  return mongoose.model("VolunteerAccount", VolunteerAccountSchema);
}
export default getVolunteerAccountModel;
