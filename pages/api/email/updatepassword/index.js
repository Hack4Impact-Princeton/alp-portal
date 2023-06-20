import dbConnect from "../../../../lib/dbConnect"
import getVolunteerAccountModel from "../../../../models/VolunteerAccount"

const handler = async (req, res) => {
    try {
        const { email, password } = JSON.parse(req.body)
        const bcrypt = require("bcryptjs")
        const salt = bcrypt.genSaltSync(10)
        const hashedPwd = (password == '') ? '' : bcrypt.hashSync(password, salt)
        console.log(hashedPwd)
        await dbConnect()
        const VolunteerAccount = getVolunteerAccountModel()
        const account = await VolunteerAccount.findOneAndUpdate({ email: email }, { pwhash: hashedPwd }, {new: true})
        res.status(200).json({success: true, data: account})
    } catch (e) {
        console.error(e)
        res.status(400).json({ success: false, data: e })
    }
}
export default handler