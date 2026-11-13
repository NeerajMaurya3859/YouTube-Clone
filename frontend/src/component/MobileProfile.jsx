import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";

import{
    FaHistory,
    FaList,
    FaThumbsUp,
}from "react-icons/fa";
import {GoVideo} from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
function MobileProfile(){
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleSignOut=async()=>{
        try {
            const result=await axios.get(serverUrl + "/api/auth/signOut",
                {withCredentials:true})
            dispatch(setUserData(null))
            console.log(result.data)
            showCustomAlert("SignOut Successfully")
        } catch (error) {
            console.log(error)
            showCustomAlert("SignOut error")
        }
    }


    // const handleGoogleAuth =async ()=>{
    //     try {
    //         const response=await signInWithPopup(auth,provider)
    //         console.log(response)
    //         let user = response.user
    //         let userName = user.displayName
    //         let email=user.email
    //         let photoUrl=user.photoURL

    //         const formData=new FormData()
    //         formData.append("userName",userName)
    //         formData.append("email",email)
    //         formData.append("photoUrl",photoUrl)
            
    //         const result=await axios.post(serverUrl + "/api/auth/googleauth",
    //             formData,{withCredentials:true})
    //         console.log(result.data)
    //          dispatch(setUserData(result.data))
    //         console.log(result.data)
    //         showCustomAlert("Google Authentication Successfully")

    //     } catch (error) {
    //         console.log("Firebase error code:",error.code);
    //         console.log("Firebase error code:",error.message);
    //         if(error.code==="auth/popup-closed-by-user"){
    //             showCustomAlert("Google login popup was closed")
    //             return ;
    //         }
    //         showCustomAlert("Google authentication failed");
    //     }
    // }

    
const handleGoogleAuth = async () => {
    try {
        // Step 1: Firebase Google Authentication
        const response = await signInWithPopup(auth, provider);

        const user = response.user;

        const userName = user.displayName;
        const email = user.email;
        const photoUrl = user.photoURL;

        // Step 2: Prepare user data
        const formData = new FormData();

        formData.append("userName", userName || "");
        formData.append("email", email || "");
        formData.append("photoUrl", photoUrl || "");

        // Step 3: Send data to backend
        const result = await axios.post(
            serverUrl + "/api/auth/googleauth",
            formData,
            { withCredentials: true }
        );

        // Step 4: Update Redux
        dispatch(setUserData(result.data));

        showCustomAlert("Google Authentication Successfully");

    } catch (error) {
        console.error("Google Authentication Error:", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Backend Error:", error.response?.data);

        if (error.code === "auth/popup-closed-by-user") {
            showCustomAlert("Google login popup was closed");
            return;
        }

        showCustomAlert("Google authentication failed");
    }
};


    return (
        <div className=" md:hidden  bg-[#0f0f0f] text-white h-[100%]
         w-[100%]  flex flex-col pt-[100px] p-[10px]">
            {/* top profile section */}
            {userData?.photoUrl && <div className="p-4 flex items-center
             gap-4 border-b border-gray-800"><img src={userData?.PhotoUrl}
              alt="Profile" className="w-16 h-16 rounded-full object-cover"/>
            <div className="flex flex-col">
                <span className="font-semibold text-lg">{userData?.userName}</span>
                <span className="text-gray-400 text-sm">{userData?.email}</span>
                <p className="text-sm text-blue-400 cursor-pointer hover:underline"
                 onClick={()=>{userData?.channel ? navigate("/viewchannel")
                 :navigate("/createchannel")}}>{userData?.channel ? "view channel":
                 "create channel"}</p>
            </div>
            </div>}
            {/* auth button */}
        <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
            <button className="bg-gray-800 w-full px-4
             py-3 rounded-full text-sm flex items-center justify-center gap-2"
             onClick={handleGoogleAuth}><FcGoogle className="text-xl"/>
             SignIn with Google Account</button>
            <button className="bg-gray-800 w-full px-4 py-3
             rounded-full text-sm flex items-center justify-center gap-2"
             onClick={()=>navigate("/signup")}><TiUserAddOutline  
             className="text-xl"/>Create New Account</button>
            <button className="bg-gray-800 w-full px-4 py-3
             rounded-full text-sm flex items-center justify-center gap-2"
             onClick={()=>navigate("/signin")}><MdOutlineSwitchAccount 
             className="text-xl"/>SignIn with Your Account</button>
            <button className="bg-gray-800 w-full px-4 py-3 
            rounded-full text-sm flex items-center justify-center gap-2"
            onClick={handleSignOut}><FiLogOut className="text-xl"/>
            SignOut </button>
        </div>
        <div className="flex flex-col mt-[20px]">
            <ProfileMenuItem icon={< FaHistory/>} text={"History"}/>
            <ProfileMenuItem icon={< FaList/>} text={"Playlists"}/>
            <ProfileMenuItem icon={< GoVideo/>} text={"Save Videos"}/>
            <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"}/>
            <ProfileMenuItem icon={< SiYoutubestudio/>} text={"PT Studio"}/>
        </div>
        </div>

    )
}

function ProfileMenuItem ({icon,text,onClick}){
return(
    <button onClick={onClick} className="w-full rounded-full 
    flex items-center gap-3 p-4 active:bg-[#272727] text-left">
    <span className="text-lg">{icon}</span>
    <span className="text-sm">{text}</span>
    </button>
)
}

export default MobileProfile