
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let active = true;
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getuser`,
                     { withCredentials: true });
                if (active) dispatch(setUserData(result.data?.user ??
                     result.data ?? null));
            } catch (error) {
                if (active) dispatch(setUserData(null));
                if (error.response?.status !== 401) console.error(
                    "Failed to fetch current user:", error);
            }
        };
        fetchUser();
        return () => { active = false; };
    }, [dispatch]);

    return null;
};

export default GetCurrentUser;
