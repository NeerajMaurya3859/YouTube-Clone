
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setChannelData } from "../redux/userSlice";

const GetChannelData = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        let active = true;
        const fetchChannel = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getchannel`,
                     { withCredentials: true });
                if (active) dispatch(setChannelData(result.data));
            } catch (error) {
                if (active && error.response?.status === 404)
                     dispatch(setChannelData(null));
                if (error.response?.status !== 404 && error.response?.status !== 401) {
                    console.error("Failed to fetch channel:", error);
                }
            }
        };
        fetchChannel();
        return () => { active = false; };
    }, [dispatch]);
    return null;
};

export default GetChannelData;
