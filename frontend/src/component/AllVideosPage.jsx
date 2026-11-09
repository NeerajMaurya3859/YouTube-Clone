
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

// function AllVideosPage() {
function AllVideosPage({serachQuery=""}){
    const { allVideosData = [] } = useSelector(state => state.content);
// new lines 
const filteredVideos=allVideosData.filter(video=>{
    const query=serachQuery.trim().toLowerCase();
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
        return <p className="text-gray-400 py-8">No videos available yet.</p>;
    }
//
if(!filteredVideos.length){
    return(<p className="text-gray-400 py-8">
        No videos found for "{serachQuery}".
    </p>)
}
    return (
        <div className="flex flex-wrap gap-6 mb-12 
    md:justify-start sm:items-center sm:justify-center">
            {/* {allVideosData.map(video => ( */}
          {filteredVideos.map(video=>(
                <VideoCard
                    key={video._id}
                    duration="0:00"
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channelLogo={video.channel?.avatar}
                    channelName={video.channel?.name}
                    id={video._id}
                    views={video.views}
                />
            ))}
        </div>
    );
}

export default AllVideosPage;
