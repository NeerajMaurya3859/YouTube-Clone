
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setLikedVideosData } from "../redux/contentSlice";
import VideoCard from "../component/VideoCard";
import { showCustomAlert } from "../component/CustomAlert";

function LikedVideos() {
    const { userData } = useSelector(state => state.user);
    const { likedVideosData } = useSelector(state => state.content);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchLikedVideos = async () => {
            if (!userData) { setLoading(false); return; }
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/content/liked-videos`,
                     { withCredentials: true });
                if (active) dispatch(setLikedVideosData(response.data));
            } catch (error) {
                console.error("Failed to fetch liked videos:", error);
                if (active) showCustomAlert(error.response?.data?.message ||
                     "Could not load liked videos");
            } finally { if (active) setLoading(false); }
        };
        fetchLikedVideos();
        return () => { active = false; };
    }, [userData, dispatch]);

    if (loading) return <p className="mt-20 text-center text-gray-400">
        Loading liked videos...</p>;
    if (!likedVideosData.length) return <div className="mt-20 text-center text-gray-400">
        No liked videos yet.</div>;

    return (
        <div className="mt-20 mb-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
            <div className="flex flex-wrap gap-6 md:justify-start sm:items-center
             sm:justify-center">
                {likedVideosData.map(video => <VideoCard key={video._id} thumbnail=
                {video.thumbnail} title={video.title} channelLogo={video.channel?.avatar}
                 channelName={video.channel?.name} id={video._id} views={video.views}
                  duration="0:00" />)}
            </div>
        </div>
    );
}

export default LikedVideos;
