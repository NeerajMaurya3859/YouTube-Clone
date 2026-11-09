import "dotenv/config"
import express from "express"
import connectDb from "./config/db.js"
// use import authRouter as app.use()
import authRouter from "./route/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./route/userRoute.js"
import contentRouter from "./route/contentRoute.js"
import aiRoute from "./route/aiRoute.js"

const port=process.env.PORT

const app=express()
app.use(cookieParser())
app.use(express.json())



app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});




app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/content",contentRouter)
app.use("/api/ai",aiRoute)
app.listen(8000,()=>{
    console.log("server started");
    connectDb()
})

