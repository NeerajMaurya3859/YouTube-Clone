import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setAllVideosData, setLoading, setError } from "../redux/contentSlice";

const GetAllVideos = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllVideos = async () => {
            dispatch(setLoading(true));
            try {
                const result = await axios.get(
                    serverUrl + "/api/content/getAllVideos",
                    { withCredentials: true }
                );
                dispatch(setAllVideosData(result.data));
                dispatch(setLoading(false));
                console.log("Videos fetched:", result.data);
            } catch (error) {
                console.log(error);
                dispatch(setError(error.message));
                dispatch(setLoading(false));
            }
        };

        fetchAllVideos();
    }, [dispatch]);

    return null;
};

export default GetAllVideos;

