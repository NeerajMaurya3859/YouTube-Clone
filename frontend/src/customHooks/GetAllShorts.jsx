import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import {
setAllShortsData,
setLoading,
setError
} from "../redux/contentSlice";

const GetAllShorts = () => {
const dispatch = useDispatch();

useEffect(() => {
    const fetchAllShorts = async () => {
        dispatch(setLoading(true));

        try {
            const result = await axios.get(
                serverUrl + "/api/content/getAllShorts",
                { withCredentials: true }
            );

            dispatch(setAllShortsData(result.data));
            dispatch(setError(null));

            console.log("Shorts fetched:", result.data);
        } catch (error) {
            console.error(
                "Error fetching Shorts:",
                error.response?.data || error.message
            );

            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    fetchAllShorts();
}, [dispatch]);

return null;


};

export default GetAllShorts;
