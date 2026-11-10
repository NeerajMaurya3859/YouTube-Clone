
import React, { useState } from "react"
import { FaBars } from "react-icons/fa";
import logo from "../assets/playtube.png"

import {
    FaUserCircle,
    FaHome,
    FaHistory,
    FaList,
    FaThumbsUp,
    FaSearch,
    FaMicrophone,
    FaTimes,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si"
import { MdOutlineSubscriptions } from "react-icons/md"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import AllVideosPage from "../component/AllVideosPage";

function Home() {
    const [SideBarOpen, SetSideBarOpen] = useState(true)
    const [selectedItem, setSelectedItem] = useState("Home")
    const [active, setActive] = useState("Home")
    const navigate = useNavigate()
    const location = useLocation()
    const { userData } = useSelector((state) => state.user)
    const [popUp, setPopUp] = useState(false)
 
    const [searchQuery,setSearchQuery]=useState("");
    const [isListening,setIsListening]=useState(false);

    const categories = ["Music", "Gaming", "Movies", "TV Shows", "News",
         "Trending", "Entertainment", "Education", "Science & Tech", "Travel",
          "Fashion", "Cooking", "Sports", "Pets", "Arts", "Comedy", "Vlogs"];

    
    const handleSearch = (e) => {
    e.preventDefault();
    // Search is performed by AllVideosPage using Redux data.
};

const handleVoiceSearch = () => {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice search is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event) => {
        const transcript =
            event.results[0][0].transcript;

        setSearchQuery(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Voice search error:", event.error);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.start();
};

    return (
        <div className='bg-[#0f0f0f] text-white min-h-screen relative'>
            <style>
                {`
                    .scrollbar-hidden {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hidden::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            {/* Navbar */}
            <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 
            fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <button
                            className="text-xl bg-[#272727] p-2 rounded-full 
                            md:inline hidden"
                            onClick={() => SetSideBarOpen(!SideBarOpen)}
                        >
                            <FaBars />
                        </button>
                        <div className="flex items-center gap-[5px]">
                            <img src={logo} alt="" className="w-[30px]" />
                            <span className="text-white font-bold text-xl tracking-tight
                             font-roboto">
                                Youtube Clone
                            </span>
                        </div>
                    </div>

{/* Search */}
<div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">

    <form
        onSubmit={handleSearch}
        className="flex flex-1"
    >
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none
             border border-gray-700"
            placeholder="Search"
        />

        {searchQuery && (
            <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="bg-[#121212] px-3 border-y border-gray-700"
                aria-label="Clear search"
            >
                <FaTimes />
            </button>
        )}

        <button
            type="submit"
            className="bg-[#272727] px-4 rounded-r-full border border-gray-700
             hover:bg-gray-600"
            aria-label="Search"
        >
            <FaSearch />
        </button>
    </form>

    <button
        type="button"
        onClick={handleVoiceSearch}
        className={`p-3 rounded-full transition ${
            isListening
                ? "bg-red-600"
                : "bg-[#272727] hover:bg-gray-600"
        }`}
        aria-label="Voice search"
        title="Search with your voice"
    >
        <FaMicrophone />
    </button>

</div>
                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {userData?.channel && (
                            <button
                                className="hidden md:flex items-center gap-1 
                                bg-[#272727] px-3 py-1 rounded-full cursor-pointer
                                 hover:bg-[#383838] transition"
                                onClick={() => navigate("/Create")}
                            >
                                <span className="text-lg">+</span>
                                <span>Create</span>
                            </button>
                        )}
                        {!userData?.photoUrl ? (
                            <FaUserCircle
                                className="text-3xl hidden md:flex text-gray-400
                                 cursor-pointer hover:text-white transition"
                                onClick={() => setPopUp(prev => !prev)}
                            />
                        ) : (
                            <img
                                src={userData?.photoUrl}
                                alt="user"
                                className="w-9 h-9 rounded-full object-cover border
                                 border-gray-700 hidden md:flex cursor-pointer
                                  hover:border-orange-500 transition"
                                onClick={() => setPopUp(prev => !prev)}
                            />
                        )}
                        <FaSearch className="text-lg md:hidden flex cursor-pointer" />
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`bg-[#0f0f0f] border-gray-800 transition-all duration-300
                 fixed top-[60px] bottom-0 z-40 ${SideBarOpen ? 'w-60' : 'w-20'} 
                 hidden md:flex flex-col overflow-y-auto border-r`}>
                <nav className="space-y-1 mt-3">
                    <SideBarItem
                        icon={<FaHome />}
                        text={"Home"}
                        open={SideBarOpen}
                        selected={selectedItem === "Home"}
                        onClick={() => { setSelectedItem("Home"); navigate("/") }}
                    />
                    <SideBarItem
                        icon={<SiYoutubeshorts />}
                        text={"Shorts"}
                        open={SideBarOpen}
                        selected={selectedItem === "Shorts"}
                        onClick={() => { setSelectedItem("Shorts"); navigate("/Shorts") }}
                    />
                    <SideBarItem
                        icon={<MdOutlineSubscriptions />}
                        text={"Subscriptions"}
                        open={SideBarOpen}
                        selected={selectedItem === "Subscriptions"}
                        onClick={() => { setSelectedItem("Subscriptions"); navigate("/Subscriptions") }}
                    />
                </nav>

                <hr className="border-gray-800 my-3" />

                {SideBarOpen && <p className="text-sm text-gray-400 px-2">YOU</p>}
                <nav className="space-y-1 mt-3">
                    <SideBarItem
                        icon={<FaHistory />}
                        text={"History"}
                        open={SideBarOpen}
                        selected={selectedItem === "History"}
                        onClick={() => { setSelectedItem("History"); navigate("/History") }}
                    />
                    <SideBarItem
                        icon={<FaList />}
                        text={"Playlist"}
                        open={SideBarOpen}
                        selected={selectedItem === "Playlist"}
                        onClick={() => { setSelectedItem("Playlist"); navigate("/CreatePlaylist") }}
                    />
                    <SideBarItem
                        icon={<GoVideo />}
                        text={"Save Videos"}
                        open={SideBarOpen}
                        selected={selectedItem === "Save Videos"}
                        onClick={() => { setSelectedItem("Save Videos"); navigate("/SavedVideos") }}
                    />
                    <SideBarItem
                        icon={<FaThumbsUp />}
                        text={"Like Videos"}
                        open={SideBarOpen}
                        selected={selectedItem === "Like Videos"}
                        onClick={() => { setSelectedItem("Like Videos"); navigate("/LikedVideos") }}
                    />
                </nav>

                <hr className="border-gray-800 my-3" />
            </aside>

            {/* Main Area */}
            <main className={`overflow-x-auto p-4 flex flex-col pb-16 transition-all
                 duration-300 ${SideBarOpen ? 'md:ml-60' : 'md:ml-20'} mt-[60px]`}>
                {location.pathname === "/" && (
                    <>
                        <div className="flex items-center gap-3 pt-2 overflow-x-auto 
                        scrollbar-hidden bg-[#0f0f0f] mb-4">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    className="whitespace-nowrap bg-[#272727] px-4 py-1 
                                    rounded-lg text-sm hover:bg-gray-700 text-white transition"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {popUp && <Profile />}
                        {/* <AllVideosPage /> */}
                       <AllVideosPage searchQuery={searchQuery} />
                    </>
                )}
                <Outlet />
            </main>

            {/* Bottom Nav for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t 
            border-gray-800 flex justify-around py-2 z-10">
                <MobileSizeNav
                    icon={<FaHome />}
                    text={"Home"}
                    active={active === "Home"}
                    onClick={() => { setActive("Home"); navigate("/") }}
                />
                <MobileSizeNav
                    icon={<SiYoutubeshorts />}
                    text={"Shorts"}
                    active={active === "Shorts"}
                    onClick={() => { setActive("Shorts"); navigate("/Shorts") }}
                />
                <MobileSizeNav
                    icon={<IoIosAddCircle size={45} />}
                    active={active === "+"}
                    onClick={() => { setActive("+"); navigate("/Create") }}
                />
                <MobileSizeNav
                    icon={<MdOutlineSubscriptions />}
                    text={"Subscription"}
                    active={active === "Subscription"}
                    onClick={() => { setActive("Subscription"); navigate("/Subscriptions") }}
                />
                <MobileSizeNav
                    icon={
                        !userData?.photoUrl ? (
                            <FaUserCircle />
                        ) : (
                            <img
                                src={userData?.photoUrl}
                                className="w-8 h-8 rounded-full object-cover border
                                 border-gray-700"
                                alt="user"
                            />
                        )
                    }
                    text={"you"}
                    active={active === "you"}
                    onClick={() => { setActive("you"); navigate("/MobilePro") }}
                />
            </nav>
        </div>
    )
}

function SideBarItem({ icon, text, open, selected, onClick }) {
    return (
        <button
            className={`flex items-center gap-4 p-2 rounded w-full transition-colors
                 ${open ? 'justify-start' : 'justify-center'} ${selected ? 'bg-[#272727]':
                     'hover:bg-[#272727]'}`}
            onClick={onClick}
        >
            <span className='text-lg'>{icon}</span>
            {open && <span className="text-sm">{text}</span>}
        </button>
    )
}

function MobileSizeNav({ icon, text, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
                 transition-all duration-300 ${active ? 'text-white' : 'text-gray-400'}
                  hover:scale-105`}
        >
            <span className="text-2xl">{icon}</span>
            {text && <span className="text-xs">{text}</span>}
        </button>
    )
}

export default Home
