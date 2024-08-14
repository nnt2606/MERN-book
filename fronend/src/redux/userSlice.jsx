import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

export const getUser = createAsyncThunk('/api/getUser', async()=>{
    const response = await axiosInstance.post('/api/getUser');
    return response;
})

export const addCart = createAsyncThunk('/api/addCart', async(data, thunkAPI)=>{
    const response = await axiosInstance.post('/api/addCart', data);
    return response.data;
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        name: '',
        username: '',
        cart: [],
        cartNumber: 0,
        address: {},
        error: null,
    },
    reducers: {
        deleteCartReducer: (state, action) =>{
            state.cartNumber = action.payload.length
        },
        orderReducer: (state, action) =>{
            state.cartNumber = 0,
            state.cart = []
        },
        changeAddress: (state, action)=>{
            state.address = {...action.payload}
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getUser.fulfilled, (state, action)=>{
            state.userId = action.payload.data._id,
            state.name = action.payload.data.name,
            state.username = action.payload.data.email,
            state.cart = action.payload.data.cart,
            state.cartNumber = action.payload.data.cart.length,
            state.address = {...action.payload.data.address}
        })
        .addCase(addCart.fulfilled, (state, action)=>{
            state.cartNumber = action.payload.cart.length
        })
    }
})

export const {deleteCartReducer, orderReducer, changeAddress} = userSlice.actions;
export default userSlice.reducer;