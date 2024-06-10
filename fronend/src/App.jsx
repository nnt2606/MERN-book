import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "antd";
import AdminHome from './pagesAdmin/AdminHome';
import ProductComponent from './pagesAdmin/ProductComponent';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import { ToastContainer } from "react-toastify";
import HeaderMain from './pages/component/HeaderMain';
import About from "./pages/About";
import Footer from "./pages/component/Footer";
import FooterBottom from "./pages/component/FooterBottom";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Journal from "./pages/Journal";
import HeaderBottom from "./pages/component/HeaderBottom";
import SpecialCase from "./pages/component/SpecialCase"
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ProtectedRoute from "./service/ProtectedRoute";
import UserAddress from "./pages/component/UserAddress";
import ConfirmOrder from "./pages/component/ConfirmOrder";
import Order from "./pages/component/Order";
import OrderDetails from "./pages/component/OrderDetail";
import HeaderAdmin from "./pagesAdmin/component/HeaderAdmin";
import SiderAdmin from "./pagesAdmin/component/SiderAdmin";
import { useState } from "react";
import OrderAdmin from "./pagesAdmin/OrderAdmin";
import ManageAdmin from "./pagesAdmin/ManageAdmin";
import DiscountAdmin from "./pagesAdmin/DiscountAdmin";
const {Header, Sider, Content} = Layout;

const LayoutUser = () =>{
  return(
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"  />
      <HeaderMain/>
      <HeaderBottom/>
      {/* <SpecialCase/> */}
      <Outlet/>
      {/* <Footer/> */}
      <FooterBottom/>
    </div>
  )
}

const LayoutAdmin = ()=>{
  const [collapsed, setCollapsed] = useState(false);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  return(
    <Layout
    style={{
          minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <SiderAdmin toggleSider={toggleSider} collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{padding: 0}}><HeaderAdmin/></Header>
          <Content style={{margin: '0 20px'}}><Outlet/></Content>
        </Layout>
    </Layout>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LayoutUser/>}>
        <Route path="home" index element={<Home/>}></Route>
        <Route path="about" element={<About/>}></Route>
        <Route path='shop' element={<Shop/>}></Route>
        <Route path="contact" element={<Contact/>}></Route>
        <Route path="journal" element={<Journal/>}></Route>
        <Route path="book/:_id" element={<ProductDetail/>}></Route>

        <Route path="cart" element={<ProtectedRoute requiredRole={["User"]} path="login">
          <Cart/>
        </ProtectedRoute>}></Route>
        <Route path="address" element={<ProtectedRoute requiredRole={["User"]} path="login">
          <UserAddress/>
        </ProtectedRoute>}></Route>
        <Route path="confirm" element={<ProtectedRoute requiredRole={["User"]} path="login">
            <ConfirmOrder/>
        </ProtectedRoute>}></Route>
        <Route path="order" element={<ProtectedRoute requiredRole={["User"]} path="login">
          <Order/>
        </ProtectedRoute>}></Route>
        <Route path="order/:_id" element={<ProtectedRoute requiredRole={["User"]} path="login">
          <OrderDetails/>
        </ProtectedRoute>}></Route>

      </Route>


      <Route path="/admin" element={
        <ProtectedRoute requiredRole={["Admin","Superadmin"]} path="/home"><LayoutAdmin/></ProtectedRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path = 'product' element={<ProductComponent/>}/>
          <Route path = 'orders' element={<OrderAdmin/>}/>
          <Route path = 'manage' element={<ManageAdmin/>}/>
          <Route path = 'discount' element={<DiscountAdmin/>}/>
      </Route>


      <Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="signup" element={<Register/>}></Route>
      </Route>
    </Route>
  )
)

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App