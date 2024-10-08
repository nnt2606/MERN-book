import { IoBook } from "react-icons/io5";
import { Menu, Input, Flex } from "antd";
import { useState, useEffect } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import { NAVBAR } from "../../const/Navigation";
import { HiMenuAlt2 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

const {Search} = Input;
const HeaderMain = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [sidenav, setSidenav] = useState(false);
    const [category, setCategory] = useState(false);
    const [brand, setBrand] = useState(false);
    const location = useLocation();
    const {userId} = useSelector((state)=>state.auth);

    useEffect(() => {
        let ResponsiveMenu = () => {
          if (window.innerWidth < 760) {
            setShowMenu(false);
          } else {
            setShowMenu(true);
          }
        };
        ResponsiveMenu();
        window.addEventListener("resize", ResponsiveMenu);
      }, []);



    return (
    <div className="w-full h-20 bg-white sticky top-0 z-50">
        <nav className="h-full px-4 max-w-container mx-auto relative">
            <Flex className="flex items-center justify-between h-full">
                <Link to="/">
                    <span className="text-orange text-4xl font-bold whitespace-nowrap lg:pl-[64px] hover:text-[#ff2802] hover:font-extrabold">bookish bliss</span>
                </Link>

                <div>
                    {showMenu==true ? (
                        <ul
                            className="flex items-center w-auto z-50 p-0 gap-2"
                        >
                            <>
                            {NAVBAR.map(({ key, label, path }) => (
                                <NavLink
                                key={key}
                                className={({ isActive }) =>
                                    `flex font-medium w-25 h-6 justify-center items-center px-8 text-base decoration-[1px] ${
                                      isActive ? 'text-orange font-extrabold underline-offset-[4px] underline' : 'text-black hoverEffect last:border-r-0'
                                    }`
                                  }
                                to={path}
                                state={{ data: location.pathname.split("/")[1] }}
                                >
                                {label}
                                </NavLink>
                            ))}
                            </>
                        </ul>
                    ):(
                        <HiMenuAlt2
                        color="black"
                        onClick={() => setSidenav(!sidenav)}
                        className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
                    />
                    )}

                    {sidenav && (
                        <div className="fixed top-0 left-0 w-full h-screen bg-white text-gray-200 bg-opacity-80 z-50">
                            <div
                                className="w-[80%] h-full relative"
                                >
                                    <div className="w-full h-full p-6">
                                        <ul className="text-black flex flex-col gap-2">
                                            {NAVBAR.map((item) => (
                                                <li
                                                className="font-medium hover:font-bold items-center text-lg hover:underline underline-offset-[4px] decoration-[1px] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                                key={item.key}
                                                >
                                                <NavLink
                                                    to={item.path}
                                                    state={{ data: location.pathname.split("/")[1] }}
                                                    onClick={() => setSidenav(false)}
                                                >
                                                    {item.label}
                                                </NavLink>
                                                </li>
                                            ))}
                                        </ul>
    
    
                                    </div>
                                    <span
                                        onClick={() => setSidenav(false)}
                                        className="w-8 h-8 border-[1px] border-black absolute top-2 -right-10 text-black text-2xl flex justify-center items-center cursor-pointer hover:border-orange hover:text-orange duration-300"
                                    >
                                        <MdClose />
                                    </span>
                            </div>
                        </div>
                    )}
                </div>
            </Flex>
        </nav>
    </div>
    );
}
 
export default HeaderMain;