
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp,
    FaVolumeMute, FaExpand, FaThumbsUp, FaThumbsDown,
    FaDownload, FaBookmark
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../component/CustomAlert";
import Description from "../../component/Description";
import { ClipLoader } from "react-spinners";

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
    <button className="flex flex-col items-center" onClick={onClick}>
        <div
            className={`${active ? "bg-white" : 
                "bg-[#00000065] border border-gray-700"
                } p-3 rounded-full hover:bg-gray-700 transition`}
        >
            <Icon size={20} className={`${active ? "text-black" : "text-white"}`} />
        </div>
        <span className="text-xs mt-1">
            {count !== undefined && `${count}`}
            <span>{label}</span>
        </span>
    </button>
);

function PlayVideo() {
    const videoRef = useRef(null);
    const viewCountedFor = useRef(null);
    const historyRecordedFor = useRef(null);
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [vol, setVol] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [commentText, setCommentText] = useState("");

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
    const { allVideosData } = useSelector(state => state.content);

    // Fetch video data
    useEffect(() => {
        if (!allVideosData || allVideosData.length === 0) {
            return;
        }

        const currentVideo = allVideosData?.find(v => v._id === videoId);
        if (!currentVideo) return;
        setVideo(currentVideo);
        setChannel(currentVideo.channel);

        if (viewCountedFor.current !== videoId) {
            viewCountedFor.current = videoId;
            axios.put(`${serverUrl}/api/content/video/${videoId}/add-view`,
                 {}, { withCredentials: true })
                .then(result => setVideo(prev => (prev ? { ...prev, 
                    views: result.data.views } : prev)))
                .catch(error => console.error("Failed to record video view:", error));
        }

        if (userData && historyRecordedFor.current !== videoId) {
            historyRecordedFor.current = videoId;
            axios.post(`${serverUrl}/api/user/history/${videoId}`, {}, { 
                withCredentials: true })
                .catch(error => console.error("Failed to update watch history:", error));
        }
    }, [videoId, allVideosData, userData]);

    // Check subscription status
    useEffect(() => {
        if (channel && userData) {
            setSubscribed(
                channel?.subscribers?.some(
                    sub =>
                        sub._id?.toString() === userData._id?.toString() ||
                        sub.toString() === userData._id?.toString()
                )
            );
        }
    }, [channel, userData]);

    // Video time update
    const handleUpdateTime = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    };

    const handleSeek = e => {
        if (!videoRef.current) return;
        const seekTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    const formatTime = time => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
    };

    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 10;
        }
    };

    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 10;
        }
    };

    const handleVolume = e => {
        const volume = parseFloat(e.target.value);
        setVol(volume);
        setIsMuted(volume === 0);
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    };

    const handleMute = () => {
        if (!videoRef.current) return;
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
    };

    const handleFullScreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

const handleSubscribe = async () => {
    if (!channel?._id || loading) return;

    setLoading(true);

    try {
        const result = await axios.post(
            serverUrl + "/api/user/toggleSubscribe",
            { channelId: channel._id },
            { withCredentials: true }
        );

        console.log("Subscription response:", result.data);

        const updatedChannel = result.data.channel;

        setChannel(prev => ({
            ...prev,
            ...updatedChannel
        }));

        setSubscribed(result.data.isSubscribed);

        showCustomAlert(result.data.message);

    } catch (error) {
        console.error(
            "Subscription error:",
            error.response?.data || error.message
        );
    } finally {
        setLoading(false);
    }
};

    const toggleLike = async () => {
        try {
            const result = await axios.put(
                `${serverUrl}/api/content/video/${videoId}/toggle-like`,
                {},
                { withCredentials: true }
            );
            setVideo(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleDislike = async () => {
        try {
            const result = await axios.put(
                `${serverUrl}/api/content/video/${videoId}/toggle-dislike`,
                {},
                { withCredentials: true }
            );
            setVideo(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSave = async () => {
        try {
            const result = await axios.put(
                `${serverUrl}/api/content/video/${videoId}/toggle-save`,
                {},
                { withCredentials: true }
            );
            setVideo(result.data);
            showCustomAlert("Video saved");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownload = () => {
        if (video?.videoUrl) {
            const link = document.createElement("a");
            link.href = video.videoUrl;
            link.download = `${video.title}.mp4`;
            link.click();
        }
    };

    if (!video) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="orange" size={50} />
            </div>
        );
    }

    return (
            <div className="min-h-screen w-full overflow-y-auto bg-[#0f0f0f]
             text-white">
                <div className="w-full px-5 lg:px-8 py-4">
               {/*  */}
            {/* Video Player */}
                <div
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                className="w-full aspect-video  bg-black rounded-lg overflow-hidden 
                relative"
                >
                    <video
                        src={video?.videoUrl}
                        className="w-full h-full object-contain"
                        controls={false}
                        autoPlay
                        ref={videoRef}
                        onTimeUpdate={handleUpdateTime}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />

                    {showControls && (
                        <div className="absolute inset-0 hidden lg:flex items-center
                         justify-center gap-6 sm:gap-10 transition-opacity duration-300
                          z-20">
                            <button
                                className="bg-black/70 p-3 sm:p-4 rounded-full
                                 hover:bg-orange-600 transition"
                                onClick={skipBackward}
                            >
                                <FaBackward size={24} />
                            </button>
                            <button
                                className="bg-black/70 p-3 sm:p-4 rounded-full
                                 hover:bg-orange-600 transition"
                                onClick={togglePlay}
                            >
                                {isPlaying ? (
                                    <FaPause size={28} />
                                ) : (
                                    <FaPlay size={28} />
                                )}
                            </button>
                            <button
                                className="bg-black/70 p-3 sm:p-4 rounded-full
                                 hover:bg-orange-600 transition"
                                onClick={skipForward}
                            >
                                <FaForward size={24} />
                            </button>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t
                     from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 
                     z-30">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            onChange={handleSeek}
                            className="w-full accent-orange-600"
                            value={progress}
                        />
                        <div className="flex items-center justify-between mt-1 
                        sm:mt-2 text-xs sm:text-sm text-gray-200">
                            <div className="flex items-center gap-3">
                                <span>
                                    {formatTime(currentTime)}/{formatTime(duration)}
                                </span>
                                <button
                                    className="bg-black/70 px-2 py-1 rounded
                                     hover:bg-orange-600 transition"
                                    onClick={skipBackward}
                                >
                                    <FaBackward size={14} />
                                </button>
                                <button
                                    className="bg-black/70 px-2 py-1 rounded
                                     hover:bg-orange-600 transition"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <FaPause size={14} />
                                    ) : (
                                        <FaPlay size={14} />
                                    )}
                                </button>
                                <button
                                    className="bg-black/70 px-2 py-1 rounded
                                     hover:bg-orange-600 transition"
                                    onClick={skipForward}
                                >
                                    <FaForward size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <button onClick={handleMute}>
                                    {isMuted ? (
                                        <FaVolumeMute size={14} />
                                    ) : (
                                        <FaVolumeUp size={14} />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    value={isMuted ? 0 : vol}
                                    onChange={handleVolume}
                                    className="accent-orange-600 w-16 sm:w-24"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                />
                                <button onClick={handleFullScreen}>
                                    <FaExpand size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Info */}
                <h1 className="mt-4 text-lg sm:text-xl font-bold text-white">
                    {video?.title}
                </h1>
                <p className="text-sm text-gray-400">
                    {video?.views?.toLocaleString()} views
                </p>

                {/* Channel and Subscribe */}
                <div className="mt-2 flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={channel?.avatar}
                            className="w-12 h-12 rounded-full border border-gray-600
                             object-cover"
                            alt=""
                        />
                        <div>
                            <h1 className="text-md font-bold">{channel?.name}</h1>
                            <h3 className="text-[13px] text-gray-400">
                                {channel?.subscribers?.length || 0} subscribers
                            </h3>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            className={`px-5 py-2 rounded-full border border-gray-600
                                 ml-4 text-md font-medium transition ${
                                isSubscribed
                                    ? "bg-black text-white hover:bg-orange-600"
                                    : "bg-white text-black hover:bg-orange-600"
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader size={20} color="black" />
                            ) : isSubscribed ? (
                                "Subscribed"
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-6 mt-3">
                        <IconButton
                            icon={FaThumbsUp}
                            label="Likes"
                            active={video?.likes?.includes(userData?._id)}
                            count={video?.likes?.length}
                            onClick={toggleLike}
                        />
                        <IconButton
                            icon={FaThumbsDown}
                            label="Dislikes"
                            active={video?.dislikes?.includes(userData?._id)}
                            count={video?.dislikes?.length}
                            onClick={toggleDislike}
                        />
                        <IconButton
                            icon={FaDownload}
                            label="Download"
                            onClick={handleDownload}
                        />
                        <IconButton
                            icon={FaBookmark}
                            label="Save"
                            active={video?.saveBy?.includes(userData?._id)}
                            onClick={toggleSave}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
                    <h2 className="text-md font-semibold mb-2">Description</h2>
                    <Description text={video?.description || "No description"} />
                </div>

                {/* Comments */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Comments</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-700 bg-[#1a1a1a]
                             text-white rounded-lg px-3 py-2 focus:outline-none focus:
                             ring-1 focus:ring-orange-600"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                        />
                        <button className="bg-orange-600 hover:bg-orange-700
                         text-white px-4 py-2 rounded-lg font-medium">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayVideo;
