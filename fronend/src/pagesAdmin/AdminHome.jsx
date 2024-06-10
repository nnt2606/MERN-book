import React from 'react';
import { useState } from 'react';
import { Flex, Layout, Menu} from 'antd';
import { FaCartShopping } from "react-icons/fa6";
import { DASHBOARD_SIDEBAR_LINKS} from '../const/Navigation';
import ProductComponent from './ProductComponent';
import { useNavigate, Outlet, useLocation} from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const AdminHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }; 
  const handleMenuClick = (path) =>{
    navigate(path)
  }

  return (
    <div>
      HOME
    </div>
  )
}

export default AdminHome