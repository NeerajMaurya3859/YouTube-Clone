
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"
import admin from "../config/firebaseAdmin.js"
export const SignUp=async(req,res)=>{
    try{
        const {userName,email,password,}=req.body
        let photoUrl
        if(req.file){
            photoUrl=await uploadOnCloudinary(req.file.path)
        }
        const existUser=await User.findOne({email})
        if(existUser){
            return res.status(404).json({message:"user is already exist."})
        }
        if(!validator.isEmail(email)){
          return res.status(404).json({message:"Invalid Email."})
        }
        if(password.length<8){
            return res.status(404).json({message:"Enter the strong password."})
        }
        const hashPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            userName,
            email,
            password:hashPassword,
            photoUrl
        })

        let token =await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            path:"/",
            maxAge:7*24*60*60*1000
        })
        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.resetOtp;
        delete safeUser.otpExpires;
        delete safeUser.isOtpVerified;
        return res.status(200).json(safeUser);
    }catch(error){
        return res.status(500).json({message:`signUp error ${error}`})
    }
}


export const SignIn=async(req,res)=>{
    try{
        const {email,password}= req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User is not found."})
        }
        const matchPassword = await bcrypt.compare(password,user.password)
        if(!matchPassword){
            return res.status(400).json({message:"Incorrect Password"})
        }
         let token =await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            path:"/",
            maxAge:7*24*60*60*1000
        })
        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.resetOtp;
        delete safeUser.otpExpires;
        delete safeUser.isOtpVerified;
        return res.status(200).json(safeUser);

    }catch(error){
        return res.status(500).json({message:`SignIn error ${error}`})
    }
}

export const SignOut=async(req,res)=>{
    try{
        await res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            path:"/"
        })
        return res.status(200).json({message:"SignOut Successfully"})
    }catch(error){
         return res.status(500).json({message:`SignOut error ${error}`})
    }

}

export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: "Firebase ID token is required"
            });
        }

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const { uid, email, name, picture, email_verified } = decodedToken;

        if (!email || !email_verified) {
            return res.status(401).json({
                message: "Google email is not verified"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                userName: name || email.split("@")[0],
                email,
                photoUrl: picture || "",
                firebaseUid: uid
            });
        } else {
            if (user.firebaseUid && user.firebaseUid !== uid) {
                return res.status(403).json({
                    message: "Firebase account mismatch"
                });
            }

            if (!user.firebaseUid) {
                user.firebaseUid = uid;
            }

            if (!user.photoUrl && picture) {
                user.photoUrl = picture;
            }

            await user.save();
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.resetOtp;
        delete safeUser.otpExpires;
        delete safeUser.isOtpVerified;

        return res.status(200).json(safeUser);

    } catch (error) {
        console.error("Google Auth Error:", error.message);

        return res.status(401).json({
            message: "Google authentication failed"
        });
    }
};

export const sendOtp =async(req,res)=>{
    try {
        const {email}=req.body
        const user =await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user is not found."})
        }
        const otp = Math.floor(1000 + Math.random()*9000 ).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000,
        user.isOtpVerified=false

        await user.save()

        await sendMail(email,otp)

        return res.status(200).json({message:"OTP send successfully"})

    } catch (error) {
      return res.status(500).json({message:`Otp send error ${error}`})
    }
}

export const verifyOtp = async (req,res)=>{
    try{
        const {email,otp}= req.body

        const user=await User.findOne({email})
        if(!user || user.resetOtp !=otp || user.otpExpires < Date.now()){
            return res.status(400).json({message:"Invalid otp"})
        }
        user.resetOtp=undefined,
        user.otpExpires=undefined,
        user.isOtpVerified=true

        await user.save()
        return res.status(200).json({message:"OTP verified successfully"})
    }catch(error){
        return res.status(500).json({message:`otp verification error ${error}`})
    }
}

export const resetPassword=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verification required"})
        }
        const hashPassword =await bcrypt.hash(password,10)
        user.password=hashPassword;
        user.isOtpVerified=false;
        user.resetOtp=undefined;
        user.otpExpires=undefined;
        await user.save()
        return res.status(200).json({message:"Password reset successfully"})
    } catch (error) {
        return res.status(500).json({message:`password reset error ${error}`})
    }
}