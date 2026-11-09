
import express from "express"
import upload from "../middleware/multer.js"
import isAuth from "../middleware/isAuth.js"
import {
    createVideo,
    getAllVideos,
    getViews,
    toggleDislikes,
    toggleLikes,
    toggleSave,
    addComment,
    getComments,
    getLikedVideos,
    getSavedVideos,
    deleteVideo
} from "../controller/videoController.js"
import {
    createShort,
    getAllShorts,
    toggleLikesShort,
    toggleDislikesShort,
    toggleSaveShort,
    getShortViews
} from "../controller/shortController.js"

import {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
} from "../controller/playlistController.js";


const contentRouter = express.Router()

// VIDEO ROUTES 

// Create video
contentRouter.post(
    "/Create-video",
    isAuth,
    upload.fields([
        { name: "video", maxCount: 1 },
        
    ]),
    createVideo
)
// delete the uploaded video

contentRouter.delete(
    "/video/:videoId",
    isAuth,
    deleteVideo
);
// 
// Get all videos
contentRouter.get("/getAllVideos", getAllVideos)

// User-specific video collections
contentRouter.get("/liked-videos", isAuth, getLikedVideos)
contentRouter.get("/saved-videos", isAuth, getSavedVideos)

// Video interactions
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDislikes)
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSave)
contentRouter.put("/video/:videoId/add-view", isAuth, getViews)

// Comments
contentRouter.post("/video/:videoId/add-comment", isAuth, addComment)
contentRouter.get("/video/:videoId/comments", getComments)

// SHORT ROUTES 

// Create short
contentRouter.post(
    "/create-short",
    isAuth,
    upload.single("Short"),
    createShort
)

// Get all shorts
contentRouter.get("/getAllShorts", getAllShorts)

// Short interactions
contentRouter.put("/short/:shortId/toggle-like", isAuth, toggleLikesShort)
contentRouter.put("/short/:shortId/toggle-dislike", isAuth, toggleDislikesShort)
contentRouter.put("/short/:shortId/toggle-save", isAuth, toggleSaveShort)
contentRouter.put("/short/:shortId/add-view", isAuth, getShortViews)


// PLAYLIST ROUTES

contentRouter.post("/playlists", isAuth, createPlaylist);

contentRouter.get("/playlists", isAuth, getMyPlaylists);

contentRouter.get(
    "/playlists/:playlistId",
    isAuth,
    getPlaylistById
);

contentRouter.post(
    "/playlists/:playlistId/videos",
    isAuth,
    addVideoToPlaylist
);

contentRouter.delete(
    "/playlists/:playlistId/videos/:videoId",
    isAuth,
    removeVideoFromPlaylist
);

contentRouter.delete(
    "/playlists/:playlistId",
    isAuth,
    deletePlaylist
);


export default contentRouter
