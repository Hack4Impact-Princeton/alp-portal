import mongoose from 'mongoose'
const {Schema} = mongoose

const BookDriveSchema = new Schema ({
    driveID: {type: String},
    organizer: {type: String},
    startDate: {type: String},
    completedDate: {type: String},
    status: {type: Number},
    booksGoal: {type: Number},
    gs: {
        fundraise: {type: String},
        terms: {type: Boolean}
    },
    cb: {
        booksCurrent: {type: Number},
        updateFreq: {type: Number},
        lastUpdate: {type: String}
    },
    pts: {
        intFee: {type: Boolean},
        domFee: {type: Boolean},
        materials: {
        boxes: {type: Boolean},
        extraCardboard: {type: Boolean},
        tape: {type: Boolean},
        mailingLabels: {type: Boolean}
        }
    },
    fl: {
        startDate: {type: String},
        endDate: {type: String},
        dateSent: {type: String},
        numBoxes: {type: Number},
        numBooks: {type: Number},
        shipFee: {type: Number}
    }
}, { collection : 'bookDrive' });

function getBookDriveModel(){
    if ('BookDrive' in mongoose.models)
      return mongoose.models.BookDrive;
    return mongoose.model("BookDrive", BookDriveSchema);
  }
export default getBookDriveModel;