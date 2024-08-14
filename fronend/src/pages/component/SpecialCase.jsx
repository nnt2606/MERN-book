import { Link, useNavigate } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";


const SpecialCase = () =>{
    const [showUser, setShowUser] = useState(false);
    const {userId, name, cartNumber} = useSelector((state)=>state.user);
    const isAdmin = useSelector((state)=>state.auth.isAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        persistor.purge();
        dispatch(logout());
        window.location.reload();
        // console.log(userId);
      }

    const handleCart = () =>{
        navigate("/cart");
    }
    return(
        <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
            <div onClick={() =>setShowUser(!showUser)}>
                <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
                    <div className="flex justify-center items-center">
                        <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
                        <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                    </div>
                    <p className="text-xs font-semibold font-titleFont">{userId===null ? "Profile" : name}</p>
                </div>
            </div>


            <div onClick = {handleCart}>
                <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
                    <div className="flex justify-center items-center">
                    <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
                    <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                    </div>
                    <p className="text-xs font-semibold font-titleFont">Buy Now</p>
                    <p className="absolute top-1 right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                        {cartNumber===null? "0":cartNumber}
                    </p>
                </div>
            </div>


            {(showUser) && (
                <div
                    className="absolute top-6 right-[70px] z-50 bg-black w-44 text-orange h-auto p-4 pb-6"
                >
                    <ul>
                    { userId !== null? (
                    <div>
                        <div >
                        <Link onClick={()=>{ setShowUser(false); handleLogout()}} >
                        <li className=" px-4 py-1 border-b-[1px] border-b-grayColor hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Logout
                        </li>
                        </Link>
                        <Link onClick={() => setShowUser(false)} to="/address">
                        <li className=" px-4 py-1 border-b-[1px] border-b-grayColor hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Address
                        </li>
                        </Link>
                        <Link onClick={() => setShowUser(false)} to="/order">
                        <li className=" px-4 py-1 border-b-[1px] border-b-grayColor hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Order
                        </li>
                        </Link>
                    </div>
                    { isAdmin &&(
                        <Link onClick={() => setShowUser(false)} to="/admin">
                        <li className=" px-4 py-1 border-b-[1px] border-b-grayColor hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Admin Page
                        </li>
                        </Link>
                    )
                    }
                    </div>
                    ): (
                    <div>
                    <Link onClick={() => setShowUser(false)} to="/login">
                        <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Login
                        </li>
                    </Link>
                    <Link onClick={() => setShowUser(false)} to="/signup">
                        <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                            Sign Up
                        </li>
                    </Link>
                    </div>
                    )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SpecialCase;