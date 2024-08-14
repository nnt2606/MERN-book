import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Form, Input,  Divider, Result } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { IoBook} from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { getUser } from '../redux/userSlice';

const Login = () => {
    const [errMsg, setErrMsg] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();
    const roles = useSelector((state) => state.auth.roles)


    const handleRedirectRegister = () =>{
      navigate('/signup');
   }

   const handleRedirectHome = () =>{
    navigate('/');
   }

   const handleRedirectAdmin = () =>{
    navigate('/admin');
   }

    useEffect(()=>{
      // console.log("ROLE CHAGNE"+roles)
      setErrMsg('')
  }, [user, pwd, roles]);



  const handleSubmit = async (e) =>{
      const data = JSON.stringify({email: user, password: pwd})
      dispatch(login({email: user, password: pwd}))
      dispatch(login({email: user, password: pwd}))
      .then((response) => {
        if (response.error) {
          setErrMsg("Incorrect password or username");
        } else {
          dispatch(getUser());
          navigate("/");
        }
      })
      .catch((error) => {
        // This will only catch unexpected errors (not errors from thunk)
        console.error("Unexpected error:"+ error);
        setErrMsg(error.response?.data?.error);
      });
  }

  return(
    <>
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lg:inline-flex h-full text-white bg-black p-4">
        <div className="w-[450px] h-full bg-black px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <IoBook size={50} className="h-8"/> 
            <span className=" self-center text-2xl font-semibold whitespace-nowrap">BookStore</span>
            </div>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay sign in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with BookStore
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all BookStore services
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © BOOKSTORE
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
            <div className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <section className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                  Sign In
                </h1>
                <Divider></Divider>
                <div className="flex flex-col gap-3">
                <Form
                    name="basic"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 50,}}
                    className="max-w-2xl w-full mt-8 items-center text-center"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >

                <Form.Item 
                    label="Username"
                    name="username"
                    id="username"
                    className="font-titleFont text-base font-semibold text-gray-600"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    }
                    ]}>
                        <Input 
                        onChange = {(e) => setUser(e.target.value)}
                        value = {user}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    id="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        }
                    ]}
                    className="font-titleFont text-base font-semibold text-gray-600"
                    >
                        <Input.Password 
                        onChange={(e)=> setPwd(e.target.value)}
                        value = {pwd}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        />
                </Form.Item>

                <p className={errMsg?"text-center text-red-500":"hidden"} aria-live="assertive">{errMsg}</p>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    
                    >
                    <Button type="primary" htmlType="submit" disabled={user==='' || pwd==='' ?true: false}
                    className="bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                    >
                        Log In
                    </Button>
                </Form.Item>

                </Form>
                <p className="text-sm text-center font-titleFont font-medium">
                    Need an account? {" "}
                    <span className="line">
                        <a onClick={handleRedirectRegister} className="text-blue-500">Register</a>
                    </span>
                </p>
                </div>
              </section>
              </div>
          
        </div>
    </div>
    </>
  )


};

export default Login;
