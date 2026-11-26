
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VideoCard({
    thumbnail,
    videoUrl,
    channelLogo,
    title,
    channelName,
    views,
    id
}) {
    const navigate = useNavigate();
    const [duration,setDuration]=useState("--:--");
    // get actual video duration
    useEffect(()=>{
        if(!videoUrl){
            setDuration("--:--");
            return ;
        }
        const video=document.createElement("video");
        video.preload="metadata";
        const handleLoadMetadata=()=>{
            const totalSeconds=video.duration;
            if(!Number.isFinite(totalSeconds)){
                setDuration("--:--");
                return ;
            }
            const hours=Math.floor(totalSeconds/3600);
            const minutes=Math.floor((totalSeconds%3600)/60);
            const seconds=Math.floor(totalSeconds%60)
            if(hours>0){
                setDuration(`${hours}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`)
            }
            else{
                setDuration(`${minutes}:${String(seconds).padStart(2,"0")}`);
            }
        };
        const handleError=()=>{
            setDuration("--:--");
        }
        video.addEventListener("loadedmetadata",handleLoadMetadata)
        video.addEventListener("error",handleError);
        video.src=videoUrl;
        video.load();
        return ()=>{
            video.removeEventListener("loadedmetadata",handleLoadMetadata)
            video.removeEventListener("error",handleError);
            video.removeAttribute("src");
            video.load();
        }
    },[videoUrl]);
    return (
        <div
            className="w-full min-w-0 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate(`/playvideo/${id}`)}>
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="rounded-xl w-full aspect-video border
                     border-gray-800 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black
                 text-white text-xs px-2 py-1 rounded">
                    {duration}
                </span>
            </div>
            <div className="flex mt-3">
                <img
                    src={channelLogo}
                    alt={channelName}
                    className="w-10 h-10 rounded-full mr-3 object-cover shrink-0"/>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{channelName}</p>
                    <p className="text-xs text-gray-400">
                        {views?.toLocaleString()} views
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
