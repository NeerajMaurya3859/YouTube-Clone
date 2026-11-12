
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
import Shorts from "./pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import GetAllVideos from "./customHooks/GetAllVideos";
import MobileProfile from "./component/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import GetChannelData from "./customHooks/getChannelData";
import { CreateChannel, ViewChannel, UpdateChannel } from "./pages/Channel"
import { useSelector } from "react-redux";
import CreatePage from "./pages/CreatePage";
import CreateVideos from "./pages/videos/CreateVideos";
import CreateShort from "./pages/Shorts/CreateShort";
import CreatePlaylist from "./pages/playlist/CreatePlaylist";
import CreatePost from "./pages/post/CreatePost";
import PlayVideo from "./pages/videos/PlayVideo";
import LikedVideos from "./pages/LikedVideos";
import SavedVideos from "./pages/SavedVideos";
import History from "./pages/History";
import Subscriptions from "./pages/Subscriptions.jsx";
import GetAllShorts from "./customHooks/GetAllShorts.jsx";

import ManageVideos from "./pages/videos/MangeVideos.jsx"
export const serverUrl = "https://youtube-clone-nhr4.onrender.com"

const ProtectRoute = ({ userData, children }) => {
    if (!userData) {
        showCustomAlert("please signUp first for use this feature")
        return <Navigate to={"/"} replace />
    }
    return children
}

function App() {
    GetCurrentUser()
    GetChannelData()
    GetAllVideos()
    GetAllShorts()

    const { userData } = useSelector(state => state.user)

    return (
        <>
            <CustomAlert />
            <Routes>
                <Route path='/' element={<Home />}>
                    <Route path='Shorts' element={<ProtectRoute userData={userData}><Shorts />
                    </ProtectRoute>} />
                    <Route path='viewchannel' element={<ProtectRoute userData={userData}><ViewChannel />
                    </ProtectRoute>} />
                    <Route path='UpdateChannel' element={<ProtectRoute userData={userData}><UpdateChannel />
                    </ProtectRoute>} />
                    <Route path='LikedVideos' element={<ProtectRoute userData={userData}><LikedVideos />
                    </ProtectRoute>} />
                    <Route path='SavedVideos' element={<ProtectRoute userData={userData}><SavedVideos />
                    </ProtectRoute>} />
                    <Route path='History' element={<ProtectRoute userData={userData}><History />
                    </ProtectRoute>} />
                    <Route path='Subscriptions' element={<ProtectRoute userData={userData}>
                        <Subscriptions /></ProtectRoute>} />
                    <Route path='Create' element={<CreatePage />} />
                    <Route path='CreateVideo' element={<CreateVideos />} />
                    <Route path='CreateShort' element={<CreateShort />} />
                    <Route path='CreatePlaylist' element={<CreatePlaylist />} />
                    <Route path='CreatePost' element={<CreatePost />} />
                </Route>

                <Route path='MobilePro' element={<MobileProfile />}/>
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/ForgetPassword' element={<ForgetPassword />} />
                <Route path='/CreateChannel' element={<ProtectRoute userData={userData}>
                    <CreateChannel /></ProtectRoute>} />
                <Route path='/playvideo/:videoId' element={<ProtectRoute userData={userData}>
                    <PlayVideo /></ProtectRoute>} />
                <Route path='ManageVideos'element={<ProtectRoute userData={userData}>
                    <ManageVideos/></ProtectRoute>}/>
            </Routes>
        </>
    )
}

export default App
