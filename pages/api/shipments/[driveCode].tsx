import dbConnect from '../../../lib/dbConnect'
import getShipmentModel from '../../../models/Shipment'

export default async function handler(req, res) {
    const {
      query: { driveCode },
      method,
    } = req

    await dbConnect()
    const Shipment = getShipmentModel();

    switch (method) {
        case 'GET' /* Get all shipments associated with driveCode */:
            try {
                const shipments = await Shipment.find({driveCode : driveCode}).exec();
                if (!shipments) {
                    res.status(400).json({success: false});
                }
                res.status(200).json({ success: true, data: shipments })
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;
        case 'POST':
            console.log("REQUEST: ", req);
        default:
            res.status(400).json({ success: false });
            break;
    }
}