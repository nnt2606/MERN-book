import { configureStore} from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./authSlice";
import userSlice from "./userSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
        auth: authReducer,
        user: userSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    
})

export const persistor = persistStore(store);
export default store;