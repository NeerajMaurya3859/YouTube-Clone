import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { setUserData } from "../redux/userSlice";
import { getAuth,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";

function Profile (){
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


    const handleGoogleAuth =async ()=>{
        try {
            // const provider =new GoogleAuthProvider()
            console.count("google auth function called")
            const response=await signInWithPopup(auth,provider)
            console.log("2.Firebase  authentication successful")
            console.log(response)
            let user = response.user
            let userName = user.displayName
            let email=user.email
            let photoUrl=user.photoURL

            const userFormData=new FormData()
            userFormData.append("userName",userName)
            userFormData.append("email",email)
            userFormData.append("photoUrl",photoUrl)
            
            const result=await axios.post(serverUrl + "/api/auth/googleauth",
                userFormData,{withCredentials:true})
            console.log(result.data)
            dispatch(setUserData(result.data))
            console.log(result.data)
            showCustomAlert("Google Authentication Successfully")

        } catch (error) {  
            console.log("Google auth error code:",error.code)
            console.log("google auth error message :",error.message)
            console.log("google auth full error",error)
            showCustomAlert("Google auth error")
        }
    }
    return(
        <div>
            <div className="absolute right-5 top=10 mt-2 w-72 bg-[#212121]
             text-white rounded-xl shadow-lg z-50 hidden md:block">
            {userData && <div className="flex items-center gap-3 p-4 border-b
             border-gray-700">
                <img src={userData?.photoUrl} alt=""className="w-12 h-12 flex
                 items-center justify-center rounded-full object-cover border-1
                  border-gray-700"/>
                <div>
                    <h4 className="font-semibold">{userData?.userName}</h4>
                    <p className="text-sm text-gray-400">{userData?.email}</p>
                    <p className="text-sm text-blue-400 cursor-pointer hover:underline"
                    onClick={()=>{userData?.channel? navigate("/viewchannel"):
                    navigate("/createchannel")}}>{userData?.channel ? "view channel":
                    "create channel"}</p>
                </div>
            </div>}
            <div className="flex flex-col py-2">
                <button className="flex items-center gap-3 px-4 py-2
                 hover:bg-gray-700"onClick={handleGoogleAuth}><FcGoogle
                  className="text-xl"/>SignIn with google account</button>
                <button className="flex items-center gap-3 px-4 py-2
                 hover:bg-gray-700"onClick={()=>navigate("/signup")}>
                    < TiUserAddOutline className="text-xl"/>
                    Create  new account</button>
                <button className="flex items-center gap-3 px-4 py-2
                 hover:bg-gray-700"onClick={()=>navigate("/signin")}>
                    <MdOutlineSwitchAccount className="text-xl"/>
                    SignIn with other account</button>
                {userData?.channel && <button className="flex items-center gap-3
             px-4 py-2 hover:bg-gray-700"><SiYoutubestudio className="text-xl"/>
             PT Studio</button>}
                {userData && <button className="flex items-center gap-3 px-4 py-2
                 hover:bg-gray-700"onClick={handleSignOut}><FiLogOut
                  className="text-xl"/>SignOut</button>}            
                </div>
            </div>
        </div>
    )
 } 

 export default Profile
