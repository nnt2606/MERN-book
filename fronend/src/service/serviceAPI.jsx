import axiosInstance from "../redux/axiosInstance";

export const getBook = async()=>{
    const response = await axiosInstance.post('/api/getBook');
    return response;
}

export const getAllCopy = async() =>{
    const response = await axiosInstance.post('/api/getAllCopy');
    return response;
}

export const createBook = async(data) =>{
    const response = await axiosInstance.post('/api/createBook', data);
    return response
}

export const deleteBook = async(data) =>{
    const response = await axiosInstance.post('/api/deleteBook', data);
    return response;
}

export const updateBook = async(data) =>{
    const response = await axiosInstance.post('/api/updateBook', data);
    return response;
}

export const getCopy = async(data) =>{
    const response = await axiosInstance.post('/api/getCopy', data);
    return response;
}

export const createCopy = async(data) =>{
    const response = await axiosInstance.post('/api/createCopy', data);
    return response;
}

export const updateCopy = async(data) =>{
    const response = await axiosInstance.post('/api/updateCopy', data);
    return response;
}

export const getAdmin = async() =>{
    const response = await axiosInstance.post('/api/getAdmin');
    return response;
}

export const getCart = async() =>{
    const response = await axiosInstance.post('/api/getCart');
    return response;
}

export const updateCart =async(data)=>{
    const response = await axiosInstance.post('/api/updateCart', data);
    return response;
}

export const deleteCart = async(data) =>{
    const response = await axiosInstance.post('/api/deleteCart', data);
    return response;
}

export const getAddress = async() =>{
    const response = await axiosInstance.post('/api/getAddress');
    return response
}

export const addAddress = async(data) => {
    const response = await axiosInstance.post('/api/addAddress', data);
    return response;
}

export const createOrder = async(data) =>{
    const response = await axiosInstance.post('/api/createOrder', data);
    return response;
}

export const getOrderByUser = async() =>{
    const response = await axiosInstance.post('/api/getOrderByUser');
    return response;
}

export const getOrderByAdmin = async() =>{
    const response = await axiosInstance.post('/api/getOrderByAdmin');
    return response;
}

export const getOrderDetail = async(data) =>{
    const response = await axiosInstance.post('/api/getOrderDetails', data);
    return response;
}

export const updateDeliveryOrder = async(data) =>{
    const response = await axiosInstance.post('/api/deliveryUpdate', data);
    return response;
}

export const cancelOrderAdmin = async(data) =>{
    const response = await axiosInstance.post('/api/acceptCancel', data);
    return response;
}

export const cancelOrderUser = async(data) =>{
    const response = await axiosInstance.post('/api/cancelOrder', data);
    return response;
}

export const finishOrder = async(data) =>{
    const response = await axiosInstance.post('/api/finishOrder', data);
    return response;
}

export const signup =  async(data, )=>{
    const response = await axiosInstance.post('auth/signup', data);
    return response;
}

export const signupAdmin =  async(data)=>{
    const response = await axiosInstance.post('auth/signupAdmin', data);
    return response;
}

export const getAllDiscount = async() =>{
    const response = await axiosInstance.post('/api/getAllDiscount');
    return response;
}