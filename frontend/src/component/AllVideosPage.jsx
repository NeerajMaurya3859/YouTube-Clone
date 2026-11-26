
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

// function AllVideosPage() {
function AllVideosPage({searchQuery=""}){
    const { allVideosData = [] } = useSelector(state => state.content);
// new lines 
const query=searchQuery.trim().toLowerCase();
const filteredVideos=allVideosData.filter(video=>{
    if(!query){
        return true;
    }
    const title=video.title?.toLowerCase()||"";
    const channelName=video.channel?.name?.toLowerCase()||"";
    return (title.includes(query)||
             channelName.includes(query))
})
//
    if (!allVideosData.length) {
        return <p className="text-gray-400 py-8"></p>;
    }
//
if(!filteredVideos.length){
    return(<p className="text-gray-400 py-8">
        No videos found for "{searchQuery}".
    </p>)
}
    return (
        <div className="w-full min-w-0 grid gap-x-6 gap-y-8 mb-12"
        style={{gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,32px),1fr))"
        }}>
            {/* {allVideosData.map(video => ( */}
          {filteredVideos.map(video=>(
            <div key={video._id} className="w-full min-w-0">
                <VideoCard
                    // key={video._id}
                    // duration="0:00"
                    thumbnail={video.thumbnail}
                    videoUrl={video.videoUrl}
                    title={video.title}
                    channelLogo={video.channel?.avatar}
                    channelName={video.channel?.name}
                    id={video._id}
                    views={video.views}
                />
                </div>
            ))}
        </div>
    );
}

export default AllVideosPage;
