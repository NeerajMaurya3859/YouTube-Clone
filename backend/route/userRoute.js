
import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    createChannel,
    getChannelData,
    getCurrentUser,
    toggleSubscribers,
    UpdateChannel,
    getSubscribedChannels,
    addWatchHistory,
    getWatchHistory,
    clearWatchHistory
} from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/getuser", isAuth, getCurrentUser);
userRouter.post("/createchannel", isAuth, upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]), createChannel);
userRouter.post("/UpdateChannel", isAuth, upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]), UpdateChannel);
userRouter.get("/getchannel", isAuth, getChannelData);
userRouter.post("/toggleSubscribe", isAuth, toggleSubscribers);
userRouter.get("/subscriptions", isAuth, getSubscribedChannels);
userRouter.post("/history/:videoId", isAuth, addWatchHistory);
userRouter.get("/history", isAuth, getWatchHistory);
userRouter.delete("/clear-history", isAuth, clearWatchHistory);

export default userRouter;
