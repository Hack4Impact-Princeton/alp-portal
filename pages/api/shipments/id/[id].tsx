import dbConnect from '../../../../lib/dbConnect'
import getShipmentModel from '../../../../models/Shipment'

export default async function handler(req, res) {
    const {
      query: { id },
      method,
    } = req

    await dbConnect()
    const Shipment = getShipmentModel();

    switch(method) {
        case 'GET': 
          console.log("here");
          try {
            const shipment = await Shipment.findById(id);
            if (!shipment) {
              return res.status(400).json({ success: false});
            }
            
            return res.status(200).json({ success: true, data: shipment });
          } catch (error) {
            res.status(400).json({ success: false })
          }
        case 'PUT': 
            try {
                /* get shipment id and update */
                const update = JSON.parse(req.body)
                const shipment = await Shipment.findOneAndUpdate({_id : id}, update, { 
                new: true,
                runValidators: true,
                })
                console.log(req.body)
                console.log(shipment)
                if (!shipment) {
                return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: shipment })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST': 
            try {
                /* create new shipment information */
                const parsedData = JSON.parse(req.body);
                const newShipment = new Shipment(parsedData);
                if (!newShipment) 
                  return res.status(400).json({ success: false })
                newShipment.save(function (err: any, shipment: any) {
                    if (err) return console.error(err);
                  console.log(shipment._id + "saved to bookstore collection.");
                  res.status(200).json({ success: true, id: shipment._id });
                  // res.newId(shipment._id);
                });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
    }

}