import {Menu, Layout, Flex, Button} from 'antd'
import { useNavigate, useLocation, Link} from 'react-router-dom';
import { useState } from 'react';
import { FaCartShopping } from "react-icons/fa6";
import { DASHBOARD_SIDEBAR_LINKS} from '../../const/Navigation';
import { IoBook } from "react-icons/io5";
const {Sider} = Layout

const SiderAdmin = ({toggleSider, collapsed}) =>{
    const navigate = useNavigate();
    const location = useLocation();

    return(
        <div className='text-white'>
           <div stype={{width: 256}}>
                <Link to="/admin">
                    <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
                    <IoBook size={50} className="h-10"/> 
                    {!collapsed && <span className="pl-3 self-center text-2xl font-semibold whitespace-nowrap">Admin</span>}
                    </div>
                </Link>

                <Menu 
                    defaultSelectedKeys={['1']}
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['sub1']} 
                    mode='inline' 
                    theme='dark'
                >
                    {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                    <Menu.Item
                        key={link.path}
                        icon={link.icon}
                        onClick={()=>navigate(link.path)}
                    >
                        {link.label}
                    </Menu.Item>
                    ))}
                </Menu>
            </div>
        </div>
    )
}

export default SiderAdmin;