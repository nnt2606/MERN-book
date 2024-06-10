import { Navigate, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({children, requiredRole, path}) =>{
    const {roles, isAdmin} = useSelector((state)=>state.auth);
    const userId = useSelector((state)=>state.user.userId);
    const navigate = useNavigate();

    console.log("NAVIGATE PROTECT ROLE")
    if(userId === null){
        console.log("USERID === NULL")
        return <Navigate to="/login"/>
    }

    if(requiredRole.length > 2){
        if(!isAdmin)
        return <Navigate to={path} />
    }

    return children;
}


export default ProtectedRoute