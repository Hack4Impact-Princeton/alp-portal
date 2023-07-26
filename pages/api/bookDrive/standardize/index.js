import dbConnect from "../../../../lib/dbConnect";
import getBookDriveModel, { BookDrive } from "../../../../models/BookDrive";
const handler = async (req, res) => {
    const method = req.method
    await dbConnect()
    const BookDrive = getBookDriveModel()
    switch (method) {
        case "PATCH": {
            // handle put request

            // if you want to standardize all book drives
            const queries = BookDrive.find({})
            const drives = await queries.exec()
            let newDrives = []
            for (const drive of drives) {
                const updatedDrive = {
                    ...drive.toObject(),
                    pts: {
                        ...drive.pts,
                        domFee: typeof drive.pts.domFee === "boolean" ? 50 : drive.pts.domFee,
                        intFee: typeof drive.pts.intFee === "boolean" ? 50 : drive.pts.intFee,
                    },
                    fl: { isFinalized: drive.fl.isFinalized ? drive.fl.isFinalized : false, shipments: drive.fl.shipments ? drive.fl.shipments : [] },
                    completedDate: !drive.completedDate || typeof drive.completedDate === "string" ? new Date() : drive.completedDate,
                    mailDate: !drive.mailDate ? new Date() : drive.mailDate,
                };

                // Delete the _id field from the updated object
                delete updatedDrive._id;
                console.log("updatedDrive", updatedDrive)

                // Use findOneAndUpdate() with the updatedDrive object to exclude the _id field from the update
                const newDrive = await BookDrive.findOneAndUpdate(
                    { driveCode: drive.driveCode },
                    updatedDrive, // 
                    { new: true }
                );
                console.log("newDrive", newDrive)
                newDrives.push(newDrive)
            }

           

            // if you want to standardize one bookdrive by id
            // const query = BookDrive.findById("64876f731c8209a873cdee34")
            // const drive = await query.exec()
            // if (!drive) {
            //     res.status(404).json({ data: "drive not found" })
            //     console.log("drive not found")
            //     break
            // }
            // console.log("drive", drive)

            // const updatedDrive = {
            //     ...drive.toObject(),
            //     pts: {
            //       ...drive.pts,
            //       domFee: typeof drive.pts.domFee === "boolean" ? 50 : drive.pts.domFee,
            //       intFee: typeof drive.pts.intFee === "boolean" ? 50 : drive.pts.intFee,
            //     },
            //     fl: {isFinalized: drive.fl.isFinalized ? drive.fl.isFinalized: false, shipments: drive.fl.shipments ?  drive.fl.shipments: []},
            //     completedDate: !drive.completedDate || typeof drive.completedDate === "string" ? new Date() : drive.completedDate,
            //     mailDate: !drive.mailDate ? new Date() : drive.mailDate,
            //   };

            //   // Delete the _id field from the updated object
            //   delete updatedDrive._id;
            //   console.log("updatedDrive", updatedDrive)

            //   // Use findOneAndUpdate() with the updatedDrive object to exclude the _id field from the update
            //   const newDrive = await BookDrive.findOneAndUpdate(
            //     { driveCode: drive.driveCode }, 
            //     updatedDrive, // 
            //     { new: true }
            //   );
            // console.log("newDrive", newDrive)
            res.status(200).json({ data: newDrives })
            break;

        }
    }

}
export default handler