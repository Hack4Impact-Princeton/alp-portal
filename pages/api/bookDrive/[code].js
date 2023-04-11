import dbConnect from '../../../lib/dbConnect'
import BookDrive from '../../../models/BookDrive'

export default async function handler(req, res) {
  const {
    query: { code },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its code */:
      try {
        const bookDrive = await BookDrive.find({driveCode : code});
        if (!bookDrive) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bookDrive })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const bookDrive = await BookDrive.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!bookDrive) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bookDrive })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST' /* Add a model by its ID */:
        try {
          const bookDrive = await BookDrive.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          })
          if (!bookDrive) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: bookDrive })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedBookDrive = await BookDrive.deleteOne({ _id: id })
        if (!deletedPet) {
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
