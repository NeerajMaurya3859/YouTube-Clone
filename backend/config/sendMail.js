import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});


const sendMail =async(to,otp)=>{
    await transporter.sendMail({
    from: process.env.USER,
    to: to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for Password Reset is<b>${otp}</b>
    It expires in 5 minutes.</p>`, // HTML body
  });
   
}


export default sendMail 