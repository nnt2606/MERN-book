import React, { useState } from "react";
import Image from "../../designLayouts/Image";

const Product = (props) =>{
    
    
    return(
        <div className="w-full relative group">
            <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
                <div>
                    <Image className="w-full h-full" imgSrc={props.img}/>
                </div>
                <div className="absolute top-6 left-8">
                    {}
                </div>
                <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                    {}
                </div>
                <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
                    <div className="flex items-center justify-between font-titleFont">
                        <h2 className="text-lg text-black font-bold">
                            {props.title}
                        </h2>
                    </div>
                    <p className="text-[#767676] text-[14px]">
                        {props.author.map(author => author.join(', '))}
                    </p>
                </div>
            </div>
        </div>
    )
}