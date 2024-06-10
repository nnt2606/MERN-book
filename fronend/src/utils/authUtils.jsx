import { useDispatch, useSelector } from "react-redux"
import { logout, refreshAccessToken } from "../redux/authSlice";


export const useAuth =  () =>{
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.auth.token)

    const handleRefreshToken = async () =>{
        try{
            dispatch(refreshAccessToken());
            
            return useSelector((state)=>state.auth.token);
        }catch(error){
            console.log("USEAUTH ERROR, LOGOUT");

            dispatch(logout());
            persistor.purge();
            return null;
        }
    }

    return {token, handleRefreshToken};
}