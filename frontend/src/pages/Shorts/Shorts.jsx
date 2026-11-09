
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../component/CustomAlert";
import { useNavigate } from "react-router-dom";

function Shorts() {
    const { allShortsData } = useSelector(state => state.content);
    const { userData } = useSelector(state => state.user);
    const [currentShortIndex, setCurrentShortIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    if (!allShortsData || allShortsData.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen
             bg-[#0f0f0f]">
                <div className="text-center">
                    <p className="text-gray-400 text-xl">No shorts available</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-orange-600 hover:bg-orange-700
                         text-white px-6 py-2 rounded-full"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const currentShort = allShortsData[currentShortIndex];

    const handleNext = () => {
        if (currentShortIndex < allShortsData.length - 1) {
            setCurrentShortIndex(currentShortIndex + 1);
            setIsPlaying(true);
        }
    };

    const handlePrev = () => {
        if (currentShortIndex > 0) {
            setCurrentShortIndex(currentShortIndex - 1);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleLike = async () => {
        if (!userData) {
            showCustomAlert("Please sign in first");
            return;
        }

        try {
            const result = await axios.put(
                `${serverUrl}/api/content/short/${currentShort._id}/toggle-like`,
                {},
                { withCredentials: true }
            );
            showCustomAlert("Liked!");
        } catch (error) {
            console.log(error);
            showCustomAlert("Error liking short");
        }
    };

    const handleDislike = async () => {
        if (!userData) {
            showCustomAlert("Please sign in first");
            return;
        }

        try {
            const result = await axios.put(
                `${serverUrl}/api/content/short/${currentShort._id}/toggle-dislike`,
                {},
                { withCredentials: true }
            );
            showCustomAlert("Disliked");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubscribe = async () => {
        if (!userData) {
            showCustomAlert("Please sign in first");
            return;
        }

        try {
            const result = await axios.post(
                serverUrl + "/api/user/toggleSubscribe",
                { channelId: currentShort.channel._id },
                { withCredentials: true }
            );
            showCustomAlert("Subscription updated");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-[#0f0f0f] min-h-screen w-full flex items-center
         justify-center overflow-hidden mt-16 mb-20">
            <div className="relative w-full max-w-md aspect-[9/16] bg-black 
            rounded-lg overflow-hidden shadow-2xl">
                {/* Video */}
                <video
                    ref={videoRef}
                    src={currentShort?.shortUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    onClick={togglePlay}
                    onEnded={handleNext}
                />

                {/* Play/Pause Overlay */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center
                     bg-black/30 z-10">
                        <button
                            onClick={togglePlay}
                            className="bg-orange-600 hover:bg-orange-700 p-4 
                            rounded-full transition"
                        >
                            <svg
                                className="w-8 h-8 text-white fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Channel Info - Top Left */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                    <img
                        src={currentShort?.channel?.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border-2
                         border-white"
                    />
                    <div>
                        <p className="text-white font-semibold text-sm">
                            {currentShort?.channel?.name}
                        </p>
                        <button
                            onClick={handleSubscribe}
                            className="text-xs bg-white text-black px-3 py-1
                             rounded-full font-medium hover:bg-gray-200 transition"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="absolute right-4 bottom-20 flex flex-col gap-6 z-20">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex flex-col items-center text-white 
                        hover:scale-110 transition"
                    >
                        <div className="bg-black/60 p-3 rounded-full">
                            <FaThumbsUp size={20} />
                        </div>
                        <span className="text-xs mt-1">
                            {currentShort?.likes?.length || 0}
                        </span>
                    </button>

                    {/* Dislike */}
                    <button
                        onClick={handleDislike}
                        className="flex flex-col items-center text-white
                         hover:scale-110 transition"
                    >
                        <div className="bg-black/60 p-3 rounded-full">
                            <FaThumbsDown size={20} />
                        </div>
                        <span className="text-xs mt-1">
                            {currentShort?.dislikes?.length || 0}
                        </span>
                    </button>

                    {/* Comment */}
                    <button className="flex flex-col items-center text-white 
                    hover:scale-110 transition">
                        <div className="bg-black/60 p-3 rounded-full">
                            <FaComment size={20} />
                        </div>
                        <span className="text-xs mt-1">
                            {currentShort?.comments ? Object.keys(currentShort.comments).
                            length : 0}
                        </span>
                    </button>

                    {/* Share */}
                    <button className="flex flex-col items-center text-white 
                    hover:scale-110 transition">
                        <div className="bg-black/60 p-3 rounded-full">
                            <FaShare size={20} />
                        </div>
                        <span className="text-xs mt-1">Share</span>
                    </button>
                </div>

                {/* Title - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t
                 from-black via-black/50 to-transparent p-4 z-20">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                        {currentShort?.title}
                    </p>
                    {currentShort?.description && (
                        <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                            {currentShort?.description}
                        </p>
                    )}
                </div>

                {/* Navigation Arrows */}
                {currentShortIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2
                         bg-black/60 hover:bg-black text-white p-2 rounded-full 
                         transition z-20"
                    >
                        ▲
                    </button>
                )}

                {currentShortIndex < allShortsData.length - 1 && (
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2
                         bg-black/60 hover:bg-black text-white p-2 rounded-full
                          transition z-20"
                    >
                        ▼
                    </button>
                )}

                {/* Progress Indicator */}
                <div className="absolute top-2 right-4 text-white text-xs
                 bg-black/60 px-2 py-1 rounded z-20">
                    {currentShortIndex + 1} / {allShortsData.length}
                </div>
            </div>
        </div>
    );
}

export default Shorts;

