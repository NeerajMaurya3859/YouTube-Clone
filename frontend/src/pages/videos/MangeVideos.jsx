import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { setAllVideosData } from "../../redux/contentSlice";

function ManageVideos() {
    const dispatch = useDispatch();

    const { allVideosData = [] } = useSelector(
        state => state.content
    );

    const { channelData } = useSelector(
        state => state.user
    );

    const [deletingId, setDeletingId] = useState(null);

    // Show only videos uploaded by this channel
    const myVideos = allVideosData.filter(video =>
        String(video.channel?._id || video.channel) ===
        String(channelData?._id)
    );

    // Delete video
    const handleDelete = async (videoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(videoId);

            const response = await axios.delete(
                `${serverUrl}/api/content/video/${videoId}`,
                {
                    withCredentials: true
                }
            );

            // Update Redux immediately
            dispatch(
                setAllVideosData(
                    allVideosData.filter(
                        video => video._id !== videoId
                    )
                )
            );

            alert(response.data.message);

        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete video"
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-5 sm:p-8">

            <h1 className="text-2xl font-bold mb-2">
                Manage Your Videos
            </h1>

            <p className="text-gray-400 mb-8">
                Manage and delete your uploaded videos.
            </p>

            {myVideos.length === 0 ? (

                <div className="text-center mt-20 text-gray-400">
                    <p className="text-xl">
                        No videos uploaded yet.
                    </p>
                </div>

            ) : (

                <div className="flex flex-col gap-5">

                    {myVideos.map(video => (

                        <div
                            key={video._id}
                            className="flex flex-col sm:flex-row gap-4 bg-[#1c1c1c] 
                            p-4 rounded-xl border border-gray-800"
                        >

                            {/* Thumbnail */}
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full sm:w-64 aspect-video object-cover 
                                rounded-lg"
                            />

                            {/* Video information */}
                            <div className="flex-1">

                                <h2 className="font-semibold text-lg">
                                    {video.title}
                                </h2>

                                <p className="text-gray-400 text-sm mt-2">
                                    {video.views || 0} views
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    Uploaded: {
                                        new Date(video.createdAt)
                                            .toLocaleDateString()
                                    }
                                </p>

                                <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                                    {video.description}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() =>
                                            handleDelete(video._id)
                                        }
                                        disabled={deletingId === video._id}
                                        className="bg-red-600 hover:bg-red-700 
                                        disabled:opacity-50 px-5 py-2 rounded-full 
                                        text-sm font-medium"
                                    >
                                        {deletingId === video._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default ManageVideos;