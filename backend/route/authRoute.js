import express from "express"
import upload from "../middleware/multer.js"
import { googleAuth, resetPassword, sendOtp, SignIn,
 SignOut, SignUp, verifyOtp } from "../controller/authController.js"

const authRouter = express.Router()

authRouter.post("/signup",upload.single("photoUrl"),SignUp)
authRouter.post("/signin",SignIn)
authRouter.get("/signOut",SignOut)
authRouter.post("/googleAuth",upload.single("photoUrl"),googleAuth)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetPassword",resetPassword)
export default authRouter