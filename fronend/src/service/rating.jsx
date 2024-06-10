import axiosInstance from "../redux/axiosInstance";

export const getRatingByBookId = async(data) =>{
    const response = await axiosInstance.post('/api/getRByBook', data);
    return response;
}

export const createNewRating = async (data) =>{
    const response = await axiosInstance.post('/api/createRating', data);
    return response;
}