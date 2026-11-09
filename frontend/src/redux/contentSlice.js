import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
    name: "content",
    initialState: {
        allVideosData: [],
        allShortsData: [],
        allPlaylistsData: [],
        allPostsData: [],
        likedVideosData: [],
        savedVideosData: [],
        watchHistory: [],
        recommendedVideos: [],
        loading: false,
        error: null
    },
    reducers: {
        setAllVideosData: (state, action) => {
            state.allVideosData = action.payload;
        },
        setAllShortsData: (state, action) => {
            state.allShortsData = action.payload;
        },
        setAllPlaylistsData: (state, action) => {
            state.allPlaylistsData = action.payload;
        },
        setAllPostsData: (state, action) => {
            state.allPostsData = action.payload;
        },
        setLikedVideosData: (state, action) => {
            state.likedVideosData = action.payload;
        },
        setSavedVideosData: (state, action) => {
            state.savedVideosData = action.payload;
        },
        setWatchHistory: (state, action) => {
            state.watchHistory = action.payload;
        },
        setRecommendedVideos: (state, action) => {
            state.recommendedVideos = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addToWatchHistory: (state, action) => {
            const video = action.payload;
            const exists = state.watchHistory.some(v => v._id === video._id);
            if (!exists) {
                state.watchHistory.unshift(video);
            }
        },
        clearWatchHistory: (state) => {
            state.watchHistory = [];
        }
    }
});

export const {
    setAllVideosData,
    setAllShortsData,
    setAllPlaylistsData,
    setAllPostsData,
    setLikedVideosData,
    setSavedVideosData,
    setWatchHistory,
    setRecommendedVideos,
    setLoading,
    setError,
    addToWatchHistory,
    clearWatchHistory
} = contentSlice.actions;

export default contentSlice.reducer;
