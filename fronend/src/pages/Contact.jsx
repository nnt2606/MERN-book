import React, { useEffect, useState } from "react";
import { PiPhoneDisconnect } from "react-icons/pi";
import {Breadcrumb, Row, Col} from 'antd';

const Contact = () =>{
    return(
        <div className="max-w-container mx-auto px-4 pl-10 pr-10">
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3 lg:pl-6">
                <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                    Contact
                </h1>
                <Breadcrumb items = {[
                    {
                        title: "Home",
                        href: '/'
                    },
                    {
                        title: "Contact"
                    }
                ]}
                />
            </div>
            <div className="pb-10 lg:pl-6">
                <h1 className="max-w-[600px] text-base text-lightText mb-2">
                    <span className="font-semibold text-lg">BookStore</span>{" "}
                    <span className="text-lg text-orange font-semibold">bookish bliss</span>{" "}
                </h1>

                <Row gutter={[16, 16]}>
                    
                    <Col span={12} xs={24} md={24} sm={24} lg={12}>
                    <div className=" text-[18px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    </div>
                    
                    </Col>
                    <Col span={12} xs={24} md={24} sm={24} lg={12}>
                        <div className="py-4">
                        <img src="https://soict.hust.edu.vn/wp-content/uploads/logo-soict-hust-1.png"
                            style={{ maxHeight: "200px"}}
                        />
                        </div>
                    </Col>
               
                </Row>
                
    
            </div>
        </div>
    )
}

export default Contact;