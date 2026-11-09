import React from "react"
import { useState } from "react"
import axios from 'axios'
import {serverUrl} from '../../App'
import { showCustomAlert } from "../../component/CustomAlert"

import { useSelector } from "react-redux"
import { ClipLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
function CreateVideos(){
    const [videoUrl,setVideoUrl]=useState(null)
    // const [thumbnail,setThumbnail]=useState(null)
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [tags,setTags]=useState("")
    const [loading,setLoading]=useState(false)
    const navigate = useNavigate()
    const {channelData}=useSelector(state=>state.user)

    const handleVideo=(e)=>{
        setVideoUrl(e.target.files[0])
    }
    // const handleThumbnail=(e)=>{
        // setThumbnail(e.target.files[0])
    // }


    const handleUploadVideo =async()=>{
           if(!channelData?._id){
            showCustomAlert("channel not found.Please create your channel first");
            return ;
           }
        //    if(!videoUrl || !thumbnail){
            // showCustomAlert("please select both a video and a thumbnail");
           if(!videoUrl){
            showCustomAlert("Please select a video");
            return ;
           }
// 
           if(!title.trim()){
            showCustomAlert("Please enter a video title");
            return ;
           }
// 
           setLoading(true)
           console.log("Channel data:", channelData);
           console.log("Channel ID:", channelData?._id);
           const userFormData=new FormData ()
           userFormData.append("title",title)
           userFormData.append("description",description)
           userFormData.append("tags",JSON.stringify(tags.split(",").map(tag=>tag.trim())))
           userFormData.append("video",videoUrl)
        //    userFormData.append("thumbnail",thumbnail)
           userFormData.append("channelId",channelData?._id)
        try {
           const result=await axios.post(serverUrl +  "/api/content/Create-video",
            userFormData,{withCredentials:true})
           console.log(result.data)
           showCustomAlert("Upload Video Successfully")
            setLoading(false)
             navigate("/")

        } catch (error) {
            console.log(error)
            showCustomAlert(error?.response?.data?.message)
            setLoading(false)
        }
    }
    return(
        <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex 
         flex-col pt-5">
            <div className="flex flex-1 justify-center items-center px-4 py-6">
                <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl 
                shadow-lg space-y-6">
                    {/* Upload Video */}
                    <label htmlFor="video" className="cursor-pointer border-2 
                     border-dashed border-gray-600 rounded-lg flex flex-col 
                     items-center justify-center p-1 hover:border-orange-500 
                     transition">
                        <input type="file"  id="video" className="w-full p-3 
                        rounded-lg bg-[#121212] border border-gray-700 text-white
                         focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                         accept="video/*"onChange={handleVideo}/>
                    </label>

                    

                    <input type="text"  placeholder="title*" onChange={(e)=>
                        setTitle(e.target.value)} value={title} className="w-full p-3
                         rounded-lg bg-[#121212] border border-gray-700
                          text-white focus:ring-2 focus:ring-orange-500 focus:
                          outline-none"/>
                
                <textarea   placeholder="description*" onChange={(e)=>setDescription(
                    e.target.value)} value={description} className="w-full p-3
                     rounded-lg bg-[#121212] border border-gray-700 text-white 
                     focus:ring-2 focus:ring-orange-500 focus:outline-none"/>
                
                <input type="text"  placeholder="tags*" className="w-full p-3 
                rounded-lg bg-[#121212] border border-gray-700 text-white 
                focus:ring-2 focus:ring-orange-500 focus:outline-none"onChange={
                    (e)=>setTags(e.target.value)} value={tags}/>
                
                    <button className="w-full bg-orange-600 hover:bg-orange-700
                     py-3 rounded-lg font-medium disabled:bg-gray-600 flex 
                     items-center justify-center"
                    // disabled={!title || !description || !tags || loading} onClick={handleUploadVideo}>{loading? <ClipLoader color="black" size={20}/>:"Upload Video"}</button>
                    disabled={!videoUrl || !title.trim() ||loading} onClick={
                        handleUploadVideo}>{loading? <ClipLoader color="black" 
                        size={20}/>:"Upload Video"}</button>

                   {loading && <p className="text-center text-gray-300 text-sm 
                   animate-pulse">Video Uploading... please wait...</p>}
                   
                </div>
            </div>
        </div>
    )
}

export default CreateVideos