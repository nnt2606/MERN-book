import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";


const SpecialCase = () =>{
    const handleSignIn = () =>{

    }

    const handleCart = () =>{

    }
    return(
        <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
            <div onClick={handleSignIn}>
                <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
                    <div className="flex justify-center items-center">
                        <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
                        <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                    </div>
                    <p className="text-xs font-semibold font-titleFont">Profile</p>
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
                        0
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SpecialCase;