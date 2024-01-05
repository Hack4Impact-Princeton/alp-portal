import dbConnect from '../../../lib/dbConnect'
import getBookDriveModel from '../../../models/BookDrive'

export default async function handler(req, res) {

  await dbConnect()
  const BookDrive = getBookDriveModel();
  switch (method) {
    case 'GET' /* Get all drives */:
      try {
        const bookDrives = await BookDrive.find({}).exec();
        if (!bookDrives) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bookDrives })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
