import dbConnect from '../../../../lib/dbConnect'
import getBookDriveModel from '../../../../models/BookDrive'

export default async function handler(req, res) {
  const {
    query: { email },
    method,
  } = req

  await dbConnect()
  const BookDrive = getBookDriveModel();
  switch (method) {
    case 'GET' /* Get a model by its email */:
      try {
        console.log(email)
        const bookDrives = await BookDrive.find({email: email}).exec();
        let ret = []
        bookDrives.forEach((drive) => {
          if (drive.email == email) {
            ret.push(drive.driveCode)
          }
        })
        if (!bookDrives) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {ret}})
      } catch (error) {
        console.log("error")
        res.status(400).json({ success: false })
      }
      break
  }
}
