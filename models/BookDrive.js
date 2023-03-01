import mongoose from 'mongoose'
const {Schema} = mongoose

const BookDriveSchema = new Schema ({
    booksCurrent: {
        type: Number
    },
    booksGoal: {
        type: Number
    },
    completedDate: {
        type: String
    },
    driveID: {
        type: String
    },
    organizer: {
        type: String
    },
    startDate: {
        type: String
    },
    status: {
        type: Number
    }
}, { collection : 'bookDrive' });

function getBookDriveModel(){
    if ('BookDrive' in mongoose.models)
      return mongoose.models.BookDrive;
    return mongoose.model("BookDrive", BookDriveSchema);
  }
export default getBookDriveModel;