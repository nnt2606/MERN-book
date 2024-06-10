import axios from 'axios';
import  store, { persistor } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import useSelection from 'antd/es/table/hooks/useSelection';
import { logout } from './authSlice';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';
import { refreshAccessToken } from './authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5555',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const { token } = state.auth;

    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("RESPONSE: ERROR RESPONSE: "+error.response.status);
    console.log("RESPONSE: ORIGINAL REQUEST: "+ originalRequest);
    if (error.response.status === 401 && !originalRequest?.sent) {
      console.log("RESPONSE>TRY: start")
      originalRequest.sent = true;
      try {
        store.dispatch(refreshAccessToken()); 
        console.log("RESPONSE>TRY: REFRESH TOKEN OK");

        const updatedToken = store.getState().auth.token;
        console.log("TOKEN UPDATE: "+ updatedToken)
        originalRequest.headers['Authorization'] = `Bearer ${updatedToken}`;
        
        return axiosInstance(originalRequest);

      } catch (error) {

        console.log("RESPONSE >CATCH : ERROR "+ error);
        
        store.dispatch(logout());
        persistor.purge();

        console.log("DELETE DATA STORAGE");

        return Promise.reject(error);
      }
        
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
