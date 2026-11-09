
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import VideoCard from "../component/VideoCard";

function Subscriptions() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchSubscriptions = async () => {
            if (!userData) { setSubscribedChannels([]); setLoading(false); return; }
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/user/subscriptions`, { withCredentials: true });
                if (active) {
                    setSubscribedChannels(response.data);
                    setSelectedChannel(current => response.data.some(c => c._id ===
                         current) ? current : (response.data[0]?._id || null));
                }
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
                if (active) showCustomAlert(error.response?.data?.message ||
                     "Could not load subscriptions");
            } finally { if (active) setLoading(false); }
        };
        fetchSubscriptions();
        return () => { active = false; };
    }, [userData]);

    if (!userData) return <div className="mt-20 text-center text-gray-400">
        <p className="mb-4">Please sign in first.</p><button onClick={() =>
         navigate("/signin")} className="rounded-full bg-orange-600 px-6 py-2 
         text-white">Sign In</button></div>;
    if (loading) return <div className="mt-20 text-center text-gray-400">
        Loading subscriptions...</div>;
    if (!subscribedChannels.length) return <div className="mt-20 text-center
     text-gray-400"><p className="mb-4">You haven't subscribed to any channels yet.
     </p><button onClick={() => navigate("/")} className="rounded-full bg-orange-600 
     px-6 py-2 text-white">Browse Videos</button></div>;

    const activeChannel = subscribedChannels.find(channel => channel._id ===
         selectedChannel);
    return (
        <div className="mt-20 mb-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
            <div className="mb-8 flex flex-wrap gap-4">
                {subscribedChannels.map(channel => <button type="button" key={channel._id}
                 onClick={() => setSelectedChannel(channel._id)} className={`rounded-lg p-4
                  transition ${selectedChannel === channel._id ? "bg-orange-600" : 
                  "bg-[#1a1a1a] hover:bg-[#272727]"}`}>
                    <img src={channel.avatar || ""} alt={channel.name} className="mx-auto mb-2 h-16
                     w-16 rounded-full object-cover" />
                    <p className="text-sm font-semibold text-white">{channel.name}</p>
                    <p className="text-xs text-gray-300">{channel.subscribers?.length || 0} 
                        subscribers</p>
                </button>)}
            </div>
            {activeChannel && <><h2 className="mb-4 text-lg font-semibold">{activeChannel.name}
                 Videos</h2><div className="flex flex-wrap gap-6">
                {(activeChannel.videos || []).map(video => <VideoCard key={video._id} thumbnail={
                    video.thumbnail} title={video.title} channelLogo={video.channel?.avatar ||
                     activeChannel.avatar} channelName={video.channel?.name || activeChannel.name}
                      id={video._id} views={video.views} duration="0:00" />)}
            </div></>}
        </div>
    );
}

export default Subscriptions;
