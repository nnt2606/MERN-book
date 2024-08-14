import React, { useState, useRef, useEffect } from "react";
import { Flex, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IoBook } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { persistor } from "../../redux/store";
import { logout } from "../../redux/authSlice";


const HeaderAdmin = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showUser, setShowUser] = useState(false);
    const roles = useSelector((state)=>state.auth.roles);
    const {userId, name} = useSelector((state)=>state.user);
    const {isSuperadmin, isAdmin} = useSelector((state)=>state.auth);

    const handleLogout = () =>{
        persistor.purge();
        dispatch(logout());
    }

      const items = [
        {
            key: '1',
            label: (
                <Link to="/">
                    Web for user
                </Link>
            )
        }
    ]

    return(
        <div className="w-full relative pl-5 pr-5 text-white">
            <Flex justify="flex-end"
            className=" bottom-0"
            >
                <Dropdown
                menu={{items}}
                placement="bottomRight"
                >
                    <div 
                        className="flex hover:underline pt-5"
                        >
                        <p className="text-lg font-medium">
                            {name}
                        </p>
                        <div className="text-lg font-medium pr-2">
                        {isSuperadmin ? (
                            <span> ( SuperAdmin)</span>
                        ):(
                            <span> ( Admin)</span>
                        )}
                        </div>
                        <span className="pt-1 pr-2">
                            <FaUser />
                            <FaCaretDown />
                        </span>
                    </div>
                    </Dropdown>
            </Flex> 
        </div>
    )
}

export default HeaderAdmin