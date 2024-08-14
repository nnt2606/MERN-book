import React, { useState, useRef, useEffect } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Flex, Dropdown } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { persistor } from "../../redux/store";

const HeaderBottom = () =>{
    const [showMenu, setShowMenu] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const [search, setSearch] = useState('');
    // const {userId, name, roles} = useSelector((state)=>state.auth);
    const {userId, name, cartNumber} = useSelector((state)=>state.user);
    const isAdmin = useSelector((state)=>state.auth.isAdmin);
    const dispatch = useDispatch();

    const ref = useRef();

    const handleSearch = () =>{
        console.log(search);
    }

    const handleLogout = () =>{
      persistor.purge();
      dispatch(logout());
      window.location.reload();
      // console.log(userId);
    }

    return(
        <div className="w-full bg-grayColor relative">
            <div className="max-w-container mx-auto">
                <Flex className="flex flex-row items-center w-full px-4 lg:pb-0 h-12 lg:h-12" align="center">
                    {/* <div className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
                         ref = {ref}
                         onClick={() => setShowMenu(!showMenu)}
                    >
                        <HiMenuAlt2 className="w-5 h-5"/>
                        <p className="text-[14px] font-normal">Menu</p>
                        {showMenu && (
                            <ul
                            className="absolute top-20 z-50 bg-black w-auto text-[#767676] h-auto p-4 pb-6"
                          >
                            <Link to={"/shop"}>
                              <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                New book
                              </li>
                            </Link>
                            <Link to={"/shop"}>
                              <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                Best seller
                              </li>
                            </Link>
                            <Link to={"/shop"}>
                              <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                Recommendation
                              </li>
                            </Link>
                            <Link to={"/shop"}>
                              <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                Most rating book
                              </li>
                            </Link>
                          </ul>
                        )}
                    </div> */}

                    {/* <div className="relative w-full lg:w-[600px] h-[50px] text-base text-black bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
                    <input
                        className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
                        type="text"
                        onChange={(e)=> setSearch(e.target.value)}
                        value={search}
                        onKeyDown={handleSearch}
                        
                        placeholder="Search your products here"
                        />
                            <FaSearch className="w-5 h-5" onClick={handleSearch}/>
                    </div> */}

                    <div className="flex gap-4 lg:mt-0 items-center pr-6 cursor-pointer relative  text-[#33475b]">
                        <div 
                          onClick={()=> setShowUser(!showUser)}
                          className="flex hover:underline hover:font-bold"
                          >
                            <p className="text-m font-medium pr-2 lg:pl-[64px]">
                              {name}
                            </p>
                            <FaUser />
                            <FaCaretDown />
                        </div>
                        {(showUser) && (
                            <div
                                className="absolute top-6 left-0 z-50 bg-black w-44 text-orange h-auto p-4 pb-6"
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
                        <Link to="/cart">
                          <div className="relative ">
                            <FaShoppingCart color="#33475b"/>
                            <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-black text-white">
                              {cartNumber===null? "0":cartNumber}
                            </span>
                          </div>
                        </Link>
                    </div>
                </Flex>
            </div>
        </div>
    )
}

export default HeaderBottom;