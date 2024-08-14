import { useDispatch, useSelector } from "react-redux"
import { logout,} from "../redux/authSlice";


export const useAuth =  () =>{
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.auth.token)

    const handleRefreshToken = async () =>{
        try{
            const response = await refreshAccessToken();
            dispatch(refreshToken(response.data.token))
            
            return useSelector(response.data.token);
        }catch(error){
            console.log("USEAUTH ERROR, LOGOUT");

            dispatch(logout());
            persistor.purge();
            return null;
        }
    }

    return {token, handleRefreshToken};
}