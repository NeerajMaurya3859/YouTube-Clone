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


const sendMail =async(to,otp,purpose="Password Reset")=>{
    await transporter.sendMail({
    from: process.env.USER,
    to,
    subject:purpose,
    html: `
    <div>
    <h2>${purpose}</h2>
    <p>Your verification OTP is</p>
    <h1>${otp}</h1>
    <p>This OTP  expires in 5 minutes.</p>
    <p>Do not share this OTP  with anyone</p>
    </div>`, // HTML body
  });
   
}


export default sendMail 