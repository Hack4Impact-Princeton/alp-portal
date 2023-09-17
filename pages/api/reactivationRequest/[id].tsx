import dbConnect from '../../../lib/dbConnect'
import getReactivationRequestModel, { ReactivationRequest } from '../../../models/ReactivationRequest'
import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req
  console.log("reactivationReqId", id)
  await dbConnect()
  const ReactivationRequestModel: mongoose.Model<ReactivationRequest> = getReactivationRequestModel();

  switch (method) {
    case 'GET':
      console.log("here");
      try {
        const reactivationReq = await ReactivationRequestModel.findOne({id: id});
        if (!reactivationReq) {
          return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: reactivationReq });
      } catch (error) {
        res.status(400).json({ success: false })
      }
    case 'PATCH':
      try {
        /* get reactivationreq id and update */
        const update = JSON.parse(req.body)
        const reactivationReq = await ReactivationRequestModel.findOneAndUpdate({ id: id }, update, {
          new: true,
          runValidators: true,
        })
        console.log(req.body)
        console.log(reactivationReq)
        if (!reactivationReq) {
          return res.status(400).json({ success: false, data: "Internal server error: something went wrong - could not access the old reactivation request" })
        }
        res.status(200).json({ success: true, data: reactivationReq })
      } catch (error) {
        res.status(400).json({ success: false, data: "internal server error - something went wrong." })
      }
      break
    case 'POST':
      try {
        /* create new reactivationReq information */
        const parsedData = JSON.parse(req.body);
        const newReactivationReq = new ReactivationRequestModel(parsedData);
        if (!newReactivationReq)
          return res.status(500).json({ success: false, data: "Internal Server Error" })
        const reactivationReq = await newReactivationReq.save();
        if (!reactivationReq) return res.status(500).json({success: false, data: "Internal server Error"})
        return res.status(200).json({success: true, data: reactivationReq})
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break;
    case 'DELETE':
        try {
            const reactivationReq = await ReactivationRequestModel.findOneAndDelete({id: id})
            if (!reactivationReq) return res.status(500).json({success: false, data: `Internal Server Error - Could not find reactivation request with id ${id} `})
            console.log(reactivationReq.id)
            return res.status(200).json({success: true, data: reactivationReq})
        } catch (e: Error | any) {
            res.status(500).json({success: false, data: e})
        }
  }

}