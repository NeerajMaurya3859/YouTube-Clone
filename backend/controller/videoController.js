
import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../model/channelModel.js"
import Video from "../model/videoModel.js"
// 
import generateThumbnail from "../utils/generateThumbnail.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
// 
// 
import { deleteFromCloudinary } from "../config/cloudinary.js";
// 
export const createVideo = async (req, res) => {
    // 
    let thumbnailPath;
    // 
    try {
        const { title, description, tags, channelId } = req.body

        if (!title || !req.files?.video?.[0] || !channelId) {
            return res.status(400).json({
                 message: "title, videoUrl, channelId is required" })
        }

        const ChannelData = await Channel.findById(channelId)
        if (!ChannelData) {
            return res.status(400).json({ 
                message: "channel is not found by Id" })
        }
        // 
        const videoPath=req.files.video[0].path;
        // generate thumbnail automatically
        thumbnailPath=path.join("public",`${uuidv4()}.jpg`)
        await generateThumbnail(videoPath,thumbnailPath)
       
        const uploadVideo=await uploadOnCloudinary(

            videoPath,"video"
        
        );
        const uploadThumbnail=await uploadOnCloudinary(
            thumbnailPath,"image"
            
        );
        if(!uploadVideo || !uploadThumbnail){ 
            throw new Error("Cloudinary upload failed");
            
        }
        let parsedTag = []
        if (tags) {
            try {
                parsedTag = JSON.parse(tags)
            } catch (error) {
                parsedTag = []
            }
        }

        const newVideo = await Video.create({
            title,
            channel: ChannelData._id,
            description,
            tags: parsedTag,
            videoUrl: uploadVideo,
            thumbnail: uploadThumbnail
        })

        await Channel.findByIdAndUpdate(
            ChannelData._id,
            { $push: { videos: newVideo._id } },
        )

        return res.status(201).json(newVideo)
    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to create video ${error}` })

    }finally {
        // Remove generated thumbnail if it still exists
        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }
    }
}
//
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.userId;

        // Find video and its channel
        const video = await Video.findById(videoId).populate("channel");

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Verify channel ownership
        const channel = video.channel;

        if (!channel || String(channel.owner) !== String(userId)) {
            return res.status(403).json({
                message: "You are not authorized to delete this video"
            });
        }

        // Delete video from Cloudinary
        await deleteFromCloudinary(video.videoUrl, "video");

        // Delete thumbnail from Cloudinary
        await deleteFromCloudinary(video.thumbnail, "image");

        // Remove video ID from channel
        await Channel.findByIdAndUpdate(channel._id, {
            $pull: { videos: video._id }
        });

        // Delete video from MongoDB
        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({
            message: "Video deleted successfully"
        });

    } catch (error) {
        console.error("Delete video error:", error);

        return res.status(500).json({
            message: "Failed to delete video",
            error: error.message
        });
    }
}; 
// 


export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate
        ("channel", "name avatar subscribers").sort({ createdAt: -1 })
        if (!videos) {
            return res.status(400).json({ message: "No videos found" })
        }
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({
             message: `Failed to get all videos ${error}` })
    }
}

export const toggleLikes = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({ 
                message: "video is not found" })
        }

        if (video.likes.includes(userId)) {
            video.likes.pull(userId)
        } else {
            video.likes.push(userId)
            video.dislikes.pull(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({
             message: `failed to like the video` })
    }
}

export const toggleDislikes = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({ 
                message: "video is not found" })
        }

        if (video.dislikes.includes(userId)) {
            video.dislikes.pull(userId)
        } else {
            video.dislikes.push(userId)
            video.likes.pull(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({ 
            message: `failed to disLike the video ${error}` })
    }
}

export const toggleSave = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({
                 message: "video is not found" })
        }

        if (video.saveBy.includes(userId)) {
            video.saveBy.pull(userId)
        } else {
            video.saveBy.push(userId)
        }
        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({
             message: `failed to save the video ${error}` })
    }
}

export const getViews = async (req, res) => {
    try {
        const { videoId } = req.params

        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!video) {
            return res.status(400).json({
                 message: "video is not found" })
        }
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({
             message: `failed to getViews ${error}` })
    }
}

export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params
        const { message } = req.body
        const userId = req.userId

        if (!message) {
            return res.status(400).json({
                 message: "Comment message is required" })
        }

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({
                 message: "Video not found" })
        }

        const commentId = new Date().getTime().toString()
        video.comments[commentId] = {
            _id: commentId,
            author: userId,
            message: message,
            replies: {},
            createdAt: new Date(),
            updateAt: new Date()
        }

        await video.save()
        return res.status(201).json(video)
    } catch (error) {
        return res.status(500).json({ 
            message: `failed to add comment ${error}` })
    }
}

export const getComments = async (req, res) => {
    try {
        const { videoId } = req.params

        const video = await Video.findById(videoId)
        .populate("comments.author", "userName photoUrl")
        if (!video) {
            return res.status(400).json({ message: "Video not found" })
        }

        const comments = Object.values(video.comments || {})
        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json({
             message: `failed to get comments ${error}` })
    }
}


export const getLikedVideos = async (req, res) => {
    try {
        const videos = await Video.find({ likes: req.userId })
            .populate("channel", "name avatar subscribers")
            .sort({ updatedAt: -1 });
        return res.status(200).json(videos);
    } catch (error) {
        console.error("getLikedVideos error:", error);
        return res.status(500).json({
             message: "Failed to fetch liked videos" });
    }
};

export const getSavedVideos = async (req, res) => {
    try {
        const videos = await Video.find({ saveBy: req.userId })
            .populate("channel", "name avatar subscribers")
            .sort({ updatedAt: -1 });
        return res.status(200).json(videos);
    } catch (error) {
        console.error("getSavedVideos error:", error);
        return res.status(500).json({
             message: "Failed to fetch saved videos" });
    }
};
