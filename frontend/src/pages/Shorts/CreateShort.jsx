import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../component/CustomAlert";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
function CreateShort(){
const {channelData}=useSelector(state=>state.user)
const [shortUrl,setShortUrl]=useState(null)
const[title,setTitle]=useState("")
const[description,setDescription]=useState("")
const[loading,setLoading]=useState("")
const[tags,setTags]=useState("")
const navigate= useNavigate()
const handleUploadShort=async ()=>{
    setLoading(true)
    const userFormData=new FormData()
           userFormData.append("title",title)
           userFormData.append("description",description)
           userFormData.append("tags",JSON.stringify(tags.split(",").map(tag=>tag.trim())))
           userFormData.append("Short",shortUrl)
           
           userFormData.append("channelId",channelData?._id)
    try {
        
        const result=await axios.post(
            serverUrl + "/api/content/create-short",userFormData,{
                withCredentials:true
            })
        console.log(result.data)
        showCustomAlert("Short Created Successfully")
        navigate("/")
        setLoading(false)

    } catch (error) {
        console.log(error)
        showCustomAlert(error.response?.data.message)
        setLoading(false)

    }
}
    return(
        <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
            <main className="flex flex-1 justify-center items-center px-4 py-6">
                <div className="bg-[#212121] p-6 rounded-xl w-full  max-w-3xl shadow-lg 
                grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* left side */}
                <div className="flex justify-center items-start">
                <label htmlFor="short" className="flex flex-col items-center justify-center 
                border-2 border-dashed hover:border-orange-400 border-gray-500 rounded-lg
                 cursor-pointer bg-[#181818] overflow-hidden width-[220px] aspect-[9/16]">
                {
                    shortUrl?
                    (
                        <video src={URL.createObjectURL(shortUrl)}className="h-full w-full 
                        object-cover controls"/>
                    ):(
                        <div className="flex flex-col items-center gap-1">
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2"/>
                        <p className="text-gray-300 text-xs text-center px-2 ">
                            Click to Upload to Short video</p>
                        <span className="text-[10px] text-gray-500">MP4 or MOV - Max 60s

                        </span>
                    </div>)
                }
                <input type="file"  id="short" onChange={(e)=>setShortUrl(e.target.files[0])}
                 className="hidden" accept="video/mp4,video/quicktime"/>
                </label>
                </div>
                {/* right side */}
                <div className="flex flex-col space-y-4">
                    <input type="text" placeholder="Title*" className="w-full p-3 rounded-lg
                     bg-[#121212] border border-gray-700 text-white focus:ring-2
                      focus:ring-orange-500 focus:outline-none"onChange={(e)=>setTitle(
                        e.target.value)} value={title} />

                    <textarea type="text" placeholder="Description*" className="w-full
                     p-3 rounded-lg bg-[#121212] border border-gray-700 text-white 
                     focus:ring-2 focus:ring-orange-500 focus:outline-none"onChange={(e)=>
                     setDescription(e.target.value)} value={description} />

                    <input type="text" placeholder="Tags (comma seperated)" 
                    className="w-full p-3 rounded-lg bg-[#121212] border
                     border-gray-700 text-white focus:ring-2 focus:ring-orange-500
                      focus:outline-none"onChange={(e)=>setTags(e.target.value)}
                       value={tags}/>

                    <button disabled={!title || !description || !tags ||loading} 
                    className="w-full bg-orange-600 hover:bg-orange-700 py-3 
                    rounded-lg font-medium disabled:bg-gray-600 flex items-center 
                    justify-center"onClick={handleUploadShort}>{loading ?<ClipLoader 
                    color="black" size={20}/>:"Upload Short"}</button>
                    {loading && <p className="text-center text-gray-300 
                    text-sm animate-pulse">Short Uploading... Please wait...</p>}
                </div>
                </div>
            </main>
        </div>
    )
}

export default CreateShort