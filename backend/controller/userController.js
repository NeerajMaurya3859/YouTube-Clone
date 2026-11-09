
import Channel from "../model/channelModel.js"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import Video from "../model/videoModel.js";
export const getCurrentUser=async(req,res)=>{
    try {
        const user=await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"user is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            message:`getCurrentUser error ${error}`})
    }
}


export const createChannel = async (req,res)=>{
    try {
        const {name,description,Category}=req.body
        const userId = req.userId
        if(!name || !Category){
            return res.status(400).json({
                message:"channel name and category are required",
                receviedCategory:Category});
        }
        const existingChannel =await Channel.findOne({owner:userId})
        if(existingChannel){
            return res.status(400).json({
                message:"User already have a channel"})
        }
        const nameExists =await Channel.findOne({name})
        if(nameExists){
            return res.status(400).json({
                message:"This channel name is reserved"})
        }
        let avatar=""
        let banner=""

        if(req.files?.avatar){
            avatar=await uploadOnCloudinary(req.files.avatar[0].path)
        }
        if(req.files?.banner?.[0]){
            banner =await uploadOnCloudinary(req.files.banner[0].path)
        }

        const channel =await Channel.create({
            name,
            description,
            Category,
            avatar,
            banner,
            owner:userId
        })

        await User.findByIdAndUpdate(userId,{
            channel:channel._id,
            userName:name,
            photoUrl:avatar
        })

        return res.status(201).json(channel)


    } catch (error) {
        return res.status(500).json({
            message:`Create Channel error ${error} `})
    }
}

export const UpdateChannel = async (req, res) => {
    try {
        const { name, description, Category, category } = req.body;
        const userId = req.userId;
        const channel = await Channel.findOne({ owner: userId });
        if (!channel) {
            return res.status(404).json({
                 message: "Channel was not found" });
        }

        const nextName = typeof name === "string" ? name.trim() : channel.name;
        const nextCategory = Category ?? category;
        if (nextName && nextName !== channel.name) {
            const nameExists = await Channel.findOne({ 
                name: nextName, _id: { $ne: channel._id } });
            if (nameExists) {
                return res.status(409).json({
                     message: "This channel name is already in use" });
            }
            channel.name = nextName;
        }
        if (description !== undefined) channel.description = description;
        if (nextCategory !== undefined && String(nextCategory).trim())
             channel.Category = String(nextCategory).trim();

        if (req.files?.avatar?.[0]) {
            channel.avatar = await uploadOnCloudinary(req.files.avatar[0].path);
        }
        if (req.files?.banner?.[0]) {
            channel.banner = await uploadOnCloudinary(req.files.banner[0].path);
        }

        await channel.save();
        await User.findByIdAndUpdate(userId, {
            channel: channel._id,
            userName: channel.name,
            photoUrl: channel.avatar || ""
        });

        const updatedChannel = await Channel.findById
        (channel._id).populate("owner", "userName email photoUrl").populate("videos");
        return res.status(200).json(updatedChannel);
    } catch (error) {
        console.error("UpdateChannel error:", error);
        return res.status(500).json({
             message: "Failed to update channel" });
    }
};

export const getChannelData = async (req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.userId })
            .populate("owner", "userName email photoUrl")
            .populate("videos");
        if (!channel) return res.status(404).json({
             message: "Channel was not found" });
        return res.status(200).json(channel);
    } catch (error) {
        console.error("getChannelData error:", error);
        return res.status(500).json({ 
            message: "Failed to get channel data" });
    }
};

export const getSubscribedChannels = async (req, res) => {
    try {
        const channels = await Channel.find({ subscribers: req.userId })
            .populate({ path: "videos", populate: { 
                path: "channel", select: "name avatar subscribers" } })
            .select("name avatar banner description Category subscribers videos owner");
        return res.status(200).json(channels);
    } catch (error) {
        console.error("getSubscribedChannels error:", error);
        return res.status(500).json({
             message: "Failed to fetch subscriptions" });
    }
};

export const addWatchHistory = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({
             message: "Video was not found" });
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ 
            message: "User was not found" });
        user.watchHistory = user.watchHistory.filter(id =>
             id.toString() !== videoId);
        user.watchHistory.unshift(video._id);
        user.watchHistory = user.watchHistory.slice(0, 100);
        await user.save();
        return res.status(200).json({
             message: "Watch history updated" });
    } catch (error) {
        console.error("addWatchHistory error:", error);
        return res.status(500).json({ 
            message: "Failed to update watch history" });
    }
};

export const getWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: "watchHistory",
            populate: { path: "channel", select: "name avatar" }
        });
        if (!user) return res.status(404).json({
             message: "User was not found" });
        return res.status(200).json((user.watchHistory || []).filter(Boolean));
    } catch (error) {
        console.error("getWatchHistory error:", error);
        return res.status(500).json({
             message: "Failed to fetch watch history" });
    }
};

export const clearWatchHistory = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId,
             { $set: { watchHistory: [] } });
        return res.status(200).json({ 
            message: "Watch history cleared" });
    } catch (error) {
        console.error("clearWatchHistory error:", error);
        return res.status(500).json({
             message: "Failed to clear watch history" });
    }
};

export const toggleSubscribers = async (req, res) => {
    try {
        const { channelId } = req.body;
        const userId = req.userId;

        if (!channelId) {
            return res.status(400).json({
                message: "channelId is required"
            });
        }

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        if (channel.owner.toString() === userId.toString()) {
            return res.status(400).json({
                message: "You cannot subscribe to your own channel"
            });
        }

        // Compare ObjectIds and strings safely.
        const alreadySubscribed = channel.subscribers.some(
            subscriber => subscriber.toString() === userId.toString()
        );

        if (alreadySubscribed) {
            channel.subscribers.pull(userId);
        } else {
            channel.subscribers.addToSet(userId);
        }

        await channel.save();

        // Return the updated channel and subscription status.
        const updatedChannel = await Channel.findById(channelId)
            .populate("owner")
            .populate("videos");

        const isSubscribed = updatedChannel.subscribers.some(
            subscriber => subscriber.toString() === userId.toString()
        );

        return res.status(200).json({
            message: isSubscribed
                ? "Subscribed successfully"
                : "Unsubscribed successfully",
            isSubscribed,
            channel: updatedChannel
        });

    } catch (error) {
        console.error("toggleSubscribers error:", error);

        return res.status(500).json({
            message: "Failed to update subscription",
            error: error.message
        });
    }
};