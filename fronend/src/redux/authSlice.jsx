import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';
import { PURGE } from 'redux-persist';

export const login = createAsyncThunk('auth/login', async(data, thunkAPI)=>{
        const response = await axiosInstance.post('auth/login', data);
        return response;
})

export const logout = createAsyncThunk('/auth/logout', async()=>{
    await axiosInstance.get('/auth/logout');
})

export const refreshAccessToken = createAsyncThunk('/auth/refresh', async()=>{
    const  response = await axiosInstance.get('/auth/refresh');
    return response;
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        roles: {},
        isAdmin: false,
        isSuperadmin: false,
    },
    reducers:{},
    extraReducers: (builder) =>{
        builder
        .addCase(login.fulfilled, (state, action)=>{
            state.token = action.payload.data.token,
            state.roles = {...action.payload.data.roles}
            state.isAdmin = Object.keys(action.payload.data.roles).length>=2?true:false
            state.isSuperadmin = Object.keys(action.payload.data.roles).length===3?true:false
            console.log("SUPERADMIN: "+state.isSuperadmin);
            console.log("ADMIN: "+state.isAdmin);
        })
        .addCase(logout.fulfilled, (state, action)=>{
            state.token = null,
            state.isAdmin= false,
            state.isSuperadmin= false,
            state.roles = {}
        })
        .addCase(refreshAccessToken.fulfilled, (state, action) =>{
            // localStorage.clear();
            // sessionStorage.clear();
            state.token = action.payload.data.token
        })
        .addCase(PURGE, (state, action)=>{
            state.token = null,
            state.roles = {}
            state.isAdmin= false,
            state.isSuperadmin= false
        })
    }
})

export default authSlice.reducer;
