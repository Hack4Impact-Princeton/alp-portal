export default async function handler(req, res) {
    try {
        const randNum = Math.floor(Math.random()*100000)
        console.log(`received request with req.body = ${req.body}`)
        let nodemailer = require("nodemailer")
        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: process.env.NOREPLY_EMAIL,
                pass: process.env.NOREPLY_CODE,
            },
            secure: true,
        })
        const mailData = {
            from: process.env.NOREPLY_EMAIL,
            to: req.body.email,
            subject: `ALP password reset verification code`,
            text: `Your password reset verification code is ${randNum}`,
            html: `<div>Your password reset verification code is ${randNum}. This code will expire in 10 minutes</div>`
        }
        transporter.sendMail(mailData, function(err, info) {
            if (err) console.error(err)
            else console.log(info)
        })
        // , function (err, info) {
        //     if (err) console.error(err)
        //     else console.log(info)
        // }
        res.status(200).json({randNum: randNum}).end()
    } catch (e) {
        res.status(400).end()
    }

}