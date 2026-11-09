
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setSavedVideosData } from "../redux/contentSlice";
import VideoCard from "../component/VideoCard";
import { showCustomAlert } from "../component/CustomAlert";

function SavedVideos() {
    const { userData } = useSelector(state => state.user);
    const { savedVideosData } = useSelector(state => state.content);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchSavedVideos = async () => {
            if (!userData) { setLoading(false); return; }
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/content/saved-videos`,
                     { withCredentials: true });
                if (active) dispatch(setSavedVideosData(response.data));
            } catch (error) {
                console.error("Failed to fetch saved videos:", error);
                if (active) showCustomAlert(error.response?.data?.message ||
                     "Could not load saved videos");
            } finally { if (active) setLoading(false); }
        };
        fetchSavedVideos();
        return () => { active = false; };
    }, [userData, dispatch]);

    if (loading) return <p className="mt-20 text-center text-gray-400">
        Loading saved videos...</p>;
    if (!savedVideosData.length) return <div className="mt-20 text-center
     text-gray-400">No saved videos yet.</div>;

    return (
        <div className="mt-20 mb-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Saved Videos</h1>
            <div className="flex flex-wrap gap-6 md:justify-start sm:items-center 
            sm:justify-center">
                {savedVideosData.map(video => <VideoCard key={video._id} thumbnail={
                    video.thumbnail} title={video.title} channelLogo={video.channel?.
                    avatar} channelName={video.channel?.name} id={video._id} views={
                    video.views} duration="0:00" />)}
            </div>
        </div>
    );
}

export default SavedVideos;
