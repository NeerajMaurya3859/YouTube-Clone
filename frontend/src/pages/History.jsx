
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setWatchHistory, clearWatchHistory } from "../redux/contentSlice";
import { showCustomAlert } from "../component/CustomAlert";

function History() {
    const { watchHistory = [] } = useSelector(state => state.content);
    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);

    useEffect(() => {
        let active = true;
        const fetchHistory = async () => {
            if (!userData) { setLoading(false); return; }
            try {
                const response = await axios.get(`${serverUrl}/api/user/history`,
                     { withCredentials: true });
                if (active) dispatch(setWatchHistory(response.data));
            } catch (error) {
                console.error("Failed to fetch watch history:", error);
                if (active) showCustomAlert(error.response?.data?.message || 
                    "Could not load watch history");
            } finally { if (active) setLoading(false); }
        };
        fetchHistory();
        return () => { active = false; };
    }, [userData, dispatch]);

    const handleClearHistory = async () => {
        if (!window.confirm("Are you sure you want to clear all watch history?"))
             return;
        setClearing(true);
        try {
            await axios.delete(`${serverUrl}/api/user/clear-history`, {
                 withCredentials: true });
            dispatch(clearWatchHistory());
            showCustomAlert("Watch history cleared");
        } catch (error) {
            console.error("Failed to clear history:", error);
            showCustomAlert(error.response?.data?.message ||
                 "Could not clear watch history");
        } finally { setClearing(false); }
    };

    if (loading) return <p className="mt-20 text-center text-gray-400">
        Loading watch history...</p>;
    if (!watchHistory.length) return <div className="mt-20 flex h-64 flex-col
     items-center justify-center"><p className="mb-4 text-lg text-gray-400">
        Your watch history is empty</p><p className="mb-6 text-sm text-gray-500">
        Videos you watch will appear here</p><button onClick={() => navigate("/")}
        className="rounded-full bg-orange-600 px-6 py-2 text-white">
        Browse Videos</button></div>;

    return (
        <div className="mt-20 mb-12 px-4">
            <div className="mb-6 flex items-center justify-between"><h1 
            className="text-2xl font-bold">Watch History</h1><button disabled=
            {clearing} onClick={handleClearHistory} className="flex items-center gap-2
             rounded-full bg-red-600 px-4 py-2 text-sm text-white disabled:
             opacity-50"><FaTrash size={16} />{clearing ? "Clearing..." : "Clear History"}
             </button></div>
            <div className="space-y-4">{watchHistory.map((video, index) =>
                 video && <div key={`${video._id}-${index}`} className="flex cursor-pointer 
                 gap-4 rounded-lg bg-[#181818] p-4 transition hover:bg-[#272727]" 
                 onClick={() => navigate(`/playvideo/${video._id}`)}><img src={video.thumbnail}
                alt={video.title} className="h-[110px] w-[200px] flex-shrink-0 rounded-lg 
                object-cover" /><div className="flex-1"><h3 className="line-clamp-2 font-semibold
               text-white hover:underline">{video.title}</h3><p className="text-sm
             text-gray-400">{video.channel?.name}</p><p className="text-sm text-gray-400">
            {video.views?.toLocaleString() || 0} views</p>{video.description && <p 
            className="mt-2 line-clamp-2 text-xs text-gray-500">{video.description}
            </p>}</div></div>)}</div>
        </div>
    );
}

export default History;
