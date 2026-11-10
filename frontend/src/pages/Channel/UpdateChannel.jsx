
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { showCustomAlert } from "../../component/CustomAlert";
import { ClipLoader } from "react-spinners";
import { setChannelData } from "../../redux/userSlice";
const serverUrl = "http://localhost:8000";  

function UpdateChannel(){

   const {channelData}=useSelector(state=>state.user)
    const [step,setStep]=useState(1)
    const [avatar,setAvatar]=useState(null)
     const [banner,setBanner]=useState(null)
    const [channelName,setChannelName]=useState(channelData?.name || "")
    const [description,setDescription]=useState(channelData?.description || "")
    const [category,setCategory]=useState(channelData?.Category
         || channelData?.category || "")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    useEffect(() => {
        if (channelData) {
            setChannelName(channelData.name || "");
            setDescription(channelData.description || "");
            setCategory(channelData.Category || channelData.category || "");
        }
    }, [channelData]);

    const handleAvatar =(e)=>{
        setAvatar(e.target.files[0])
    }
    const handleBanner =(e)=>{
        setBanner(e.target.files[0])
    }

    const nextStep=()=>{setStep((prev)=>prev+1)}
    const prevStep=()=>{setStep((prev)=>prev-1)}



    const handleUpdateChannel=async ()=>{
        const userFormData=new FormData()
        userFormData.append("name",channelName)
        userFormData.append("description",description)
        userFormData.append("Category",category)
        if (avatar) userFormData.append("avatar", avatar)
        if (banner) userFormData.append("banner", banner)
        setLoading(true)
        try {
            const result=await axios.post(serverUrl +
             "/api/user/UpdateChannel",userFormData,{withCredentials:true})
            setLoading(false)
            console.log(result.data)
            dispatch(setChannelData(result.data))
            showCustomAlert("Channel Updated")
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
            showCustomAlert("Channel Update error")
           
        }
    }
    
 return(
    <div className="w-full min-h-screen bg-[#0f0f0f]
     text-white flex flex-col">
           
            <main className=" flex flex-1 justify-center items-center px-4">
                <div className="bg-[#212121] p-6 rounded-xl
                 w-full max-w-lg shadow-lg">
                    {step === 1 &&(
                    <>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">How you'll appear</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Choose your profile picture , channel name</p>
                        <div className="flex flex-col items-center mb-6">
                        <label htmlFor="avatar" className="cursor-pointer
                         flex flex-col items-center">
                            {avatar ? 
                            (<img src={URL.createObjectURL(avatar)} className="w-20
                             h-20 rounded-2xl object-cover border-gray-600"/>)
                            :(<div className="w-20 h-20 bg-gray-700 rounded-full 
                            flex items-center justify-center text-gray-400">
                                <FaUserCircle size={40}/></div>)}
                        <span className="text-blue-400 text-sm mt-2">Upload Avatar</span>
                        <input type="file" className="hidden" id="avatar" accept="image/*"
                         onChange={handleAvatar}/>
                        </label>
                        </div>
                    </div>
                    <input type="text" placeholder="Channel Name" className='w-full p-3
                     mb-4 rounded-lg bg-[#121212] border border-gray-700
                      text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      onChange={(e)=>setChannelName(e.target.value)} value={channelName}/>
                    <button onClick={nextStep} disabled={!channelName} className="w-full
                     flex item-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 
                     transistion py-3 rounded-lg font-medium disabled:bg-gray-600">
                        Continue</button>
                    <span className="w-full flex items-center justify-center text-sm
                     text-blue-400 cursor-pointer hover:underline mt-2"onClick={
                        ()=>navigate("/")}>Back to Home</span>
                    </>
                    )}



                    {step === 2 &&(
                    <>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Customize Channel</h2>
                        <div className="flex flex-col items-center mb-6">
                        <label  className="cursor-pointer flex flex-col items-center">
                            {avatar ? 
                            (<img src={URL.createObjectURL(avatar)} className="w-20 
                            h-20 rounded-2xl object-cover border-gray-600"/>)
                            :(<div className="w-20 h-20 bg-gray-700 rounded-full 
                            flex items-center justify-center text-gray-400">
                                <FaUserCircle size={40}/></div>)}
                       
                        </label>
                        <h2 className="mt-3 text-lg font-semibold">{channelName}</h2>
                        </div>
                    </div>
                   
                    <button onClick={nextStep} disabled={!channelName} 
                    className="w-full flex item-center justify-center gap-2
                     bg-orange-600 hover:bg-orange-700 transistion py-3 rounded-lg
                      font-medium disabled:bg-gray-600">Continue and Customize Channel
                      </button>
                    <span className="w-full flex items-center justify-center text-sm
                     text-blue-400 cursor-pointer hover:underline mt-2"
                     onClick={prevStep}>Back </span>
                    </>
                    )}




                     {step === 3 &&(
                    <>
                    
                        <h2 className="text-2xl font-semibold mb-4">Customize Channel</h2>
                       
                        <div className="flex flex-col items-center mb-6">
                        <label htmlFor="banner" className="w-full
                         cursor-pointer flex flex-col items-center">
                            {banner ? 
                            (<img src={URL.createObjectURL(banner)} className="w-20 
                            h-20 rounded-2xl object-cover border-gray-600"/>)
                            :(<div className="w-full h-32 bg-gray-700 rounded-lg
                             flex items-center justify-center text-gray-400 border
                              border-gray-700 mb-2">click to upload banner image</div>)}
                        <span className="text-blue-400 text-sm mt-2">
                            Upload banner Imgae</span>
                        <input type="file" className="hidden" id="banner" accept="image/*"
                         onChange={handleBanner}/>
                        </label>

                        </div>
                    <textarea className="w-full p-3 mb-4 rounded-lg bg-[#121212]
                     border border-gray-700 text-white focus:outline-none focus:ring-2
                      focus:ring-orange-500 " placeholder="Channel Description" 
                      onChange={(e)=>setDescription(e.target.value)}value={description}/>
                    <input type="text" placeholder="Channel Category" className='w-full 
                    p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700
                     text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                     onChange={(e)=>setCategory(e.target.value)} value={category}/>
                    <button onClick={handleUpdateChannel} disabled={!description || 
                        !category || loading} className="w-full flex item-center justify-center
                         gap-2 bg-orange-600 hover:bg-orange-700 transistion py-3 
                         rounded-lg font-medium disabled:bg-gray-600" >{loading? 
                         <ClipLoader color='black' size={20}/>:"Save and Customize Channel"}
                         </button>
                    <span className="w-full flex items-center justify-center text-sm
                     text-blue-400 cursor-pointer hover:underline mt-2"onClick={prevStep}>
                        Back </span>
                    </>
                    )}
                </div>
            </main>
        </div>
    )


 
}

export default UpdateChannel;