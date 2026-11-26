
import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
  userName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  emailVerified:{
    type:Boolean,
    default:false
  },
  password:{
    type:String
  },
  photoUrl:{
    type:String,
    default:""
  },
  channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Channel"
  },
  watchHistory:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
  }],
  firebaseUid:{
  type:String,
  default:null
},
resetOtp:{type:String,
  default:null,
},
otpExpires:{type:Date,
  default:null,
},
isOtpVerified:{type:Boolean,default:false},

},{timestamps:true})




const User=mongoose.model("User",userSchema)

export default User