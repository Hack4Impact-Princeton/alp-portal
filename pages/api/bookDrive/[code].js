import dbConnect from '../../../lib/dbConnect'
import getBookDriveModel from '../../../models/BookDrive'

export default async function handler(req, res) {
  const {
    query: { code },
    method,
  } = req
  console.log("hi")
  await dbConnect()
  const BookDrive = getBookDriveModel();
  switch (method) {
    case 'GET' /* Get a model by its code */:
      try {
        const bookDrive = await BookDrive.findOne({driveCode : code}).exec();
        if (!bookDrive) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bookDrive })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its code */:
      try {
        /* get code and update */
        const update = JSON.parse(req.body)
        const bookDrive = await BookDrive.findOneAndUpdate({driveCode : code}, update, { 
          new: true,
          runValidators: true,
        })
        console.log(req.body)
        console.log(bookDrive)
        if (!bookDrive) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bookDrive })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST': /* Create new Drive */
        try {
          console.log("code", code)
          if (await BookDrive.exists({driveCode : code})) {
              console.log("drive already exists")
              return res.status(400).json({ success: false })
          }
          const parsedData = JSON.parse(req.body);
          if (code != parsedData.driveCode){
            console.log("api code and driveCode do not match")
            return res.status(400).json({ success: false })
          }
          const newDrive = new BookDrive(parsedData);
          if (!newDrive) 
            return res.status(400).json({ success: false })
          newDrive.save(function (err, drive) {
            if (err) return res.status(500).json({success: false, data: err});
            console.log(drive.driveName + " saved to bookstore collection.");
          });
          res.status(200).json({ success: true, data: newDrive })
        } catch (error) {
          console.log(error)
          res.status(400).json({ success: false })
        }
        break
    case 'DELETE' /* Delete a model by its code */:
      try {
        const deletedBookDrive = await BookDrive.findOneAndDelete({driveCode : code});
        if (!deletedBookDrive) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
