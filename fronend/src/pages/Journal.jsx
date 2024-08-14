import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {Breadcrumb} from 'antd';

const Journal = () =>{
    return(
        <div className="max-w-container mx-auto px-4 pl-10 pr-10">
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
            <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                Journal
            </h1>
            <Breadcrumb items = {[
                {
                    title: "Home",
                    href: '/'
                },
                {
                    title: "Journal"
                }
            ]}
            />
            </div>
            <div className="pb-10">
                <h1 className="max-w-[600px] text-base text-lightText mb-2">
                <span className="text-primeColor font-semibold text-lg">BookStore</span>{" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </h1>
                <Link to="/shop">
                <button className="w-52 h-10 bg-primeColor text-white bg-black duration-300">
                    Continue Shopping
                </button>
                </Link>
            </div>
        </div>
    )
}

export default Journal;