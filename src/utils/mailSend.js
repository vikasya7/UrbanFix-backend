import nodemailer from "nodemailer"
import { asyncHandler } from "./asyncHandler.js"


const mailSend= async({to, subject,html})=>{
    const transporter=nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
    })

    await transporter.sendMail({
        from:`"UrbanFix ${process.env.MAIL_USER}"`,
        to,
        subject,
        html,
    })
}
export {mailSend}