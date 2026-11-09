
import mongoose from "mongoose";
import Playlist from "../model/playlistModel.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";

// Create a playlist
export const createPlaylist = async (req, res) => {
    try {
        const { title, description = "" } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                message: "Playlist title is required"
            });
        }

        // Automatically find the logged-in user's channel.
        const channel = await Channel.findOne({
            owner: req.userId
        });

        if (!channel) {
            return res.status(404).json({
                message: "Create a channel before creating a playlist"
            });
        }

        const newPlaylist = await Playlist.create({
            channel: channel._id,
            title: title.trim(),
            description: description.trim(),
            videos: [],
            saveBy: []
        });

        await Channel.findByIdAndUpdate(channel._id, {
            $addToSet: { playlists: newPlaylist._id }
        });

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist: newPlaylist
        });

    } catch (error) {
        console.error("createPlaylist:", error);

        return res.status(500).json({
            message: "Failed to create playlist"
        });
    }
};



// Get playlists belonging to the logged-in user's channels
export const getMyPlaylists = async (req, res) => {
    try {
        const channels = await Channel.find({
            owner: req.userId
        }).select("_id");

        const channelIds = channels.map(channel => channel._id);

        const playlists = await Playlist.find({
            channel: { $in: channelIds }
        })
            .populate({
                path: "videos",
                populate: {
                    path: "channel",
                    select: "name avatar"
                }
            })
            .populate("channel", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json(playlists);
    } catch (error) {
        console.error("getMyPlaylists:", error);

        return res.status(500).json({
            message: "Failed to fetch playlists"
        });
    }
};


// Get a single playlist
export const getPlaylistById = async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!mongoose.isValidObjectId(playlistId)) {
            return res.status(400).json({
                message: "Invalid playlist ID"
            });
        }

        const result = await Playlist.findById(playlistId)
            .populate({
                path: "videos",
                populate: {
                    path: "channel",
                    select: "name avatar"
                }
            })
            .populate("channel", "name avatar owner");

        if (!result) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("getPlaylistById:", error);

        return res.status(500).json({
            message: "Failed to fetch playlist"
        });
    }
};


// Add a video to a playlist
export const addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { videoId } = req.body;

        if (
            !mongoose.isValidObjectId(playlistId) ||
            !mongoose.isValidObjectId(videoId)
        ) {
            return res.status(400).json({
                message: "Invalid playlist ID or video ID"
            });
        }

        const playlistData = await Playlist.findById(playlistId);

        if (!playlistData) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        const channel = await Channel.findOne({
            _id: playlistData.channel,
            owner: req.userId
        });

        if (!channel) {
            return res.status(403).json({
                message: "You cannot modify this playlist"
            });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        await Playlist.findByIdAndUpdate(playlistId, {
            $addToSet: { videos: videoId }
        });

        const updatedPlaylist = await Playlist.findById(playlistId)
            .populate("videos");

        return res.status(200).json({
            message: "Video added to playlist",
            playlist: updatedPlaylist
        });
    } catch (error) {
        console.error("addVideoToPlaylist:", error);

        return res.status(500).json({
            message: "Failed to add video to playlist"
        });
    }
};


// Remove a video from a playlist
export const removeVideoFromPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        if (
            !mongoose.isValidObjectId(playlistId) ||
            !mongoose.isValidObjectId(videoId)
        ) {
            return res.status(400).json({
                message: "Invalid playlist ID or video ID"
            });
        }

        const playlistData = await Playlist.findById(playlistId);

        if (!playlistData) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        const channel = await Channel.findOne({
            _id: playlistData.channel,
            owner: req.userId
        });

        if (!channel) {
            return res.status(403).json({
                message: "You cannot modify this playlist"
            });
        }

        await Playlist.findByIdAndUpdate(playlistId, {
            $pull: { videos: videoId }
        });

        return res.status(200).json({
            message: "Video removed from playlist"
        });
    } catch (error) {
        console.error("removeVideoFromPlaylist:", error);

        return res.status(500).json({
            message: "Failed to remove video from playlist"
        });
    }
};


// Delete a playlist
export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!mongoose.isValidObjectId(playlistId)) {
            return res.status(400).json({
                message: "Invalid playlist ID"
            });
        }

        const playlistData = await Playlist.findById(playlistId);

        if (!playlistData) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        const channel = await Channel.findOne({
            _id: playlistData.channel,
            owner: req.userId
        });

        if (!channel) {
            return res.status(403).json({
                message: "You cannot delete this playlist"
            });
        }

        await Playlist.findByIdAndDelete(playlistId);

        await Channel.findByIdAndUpdate(channel._id, {
            $pull: { playlists: playlistData._id }
        });

        return res.status(200).json({
            message: "Playlist deleted successfully"
        });
    } catch (error) {
        console.error("deletePlaylist:", error);

        return res.status(500).json({
            message: "Failed to delete playlist"
        });
    }
};

