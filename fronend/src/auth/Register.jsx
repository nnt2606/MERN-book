import { useRef, useState, useEffect } from "react";
import React from 'react';
import { Button, Checkbox, Form, Input, message, Result, notification, Divider } from 'antd';
import { useNavigate, Link } from "react-router-dom";
import { IoBook} from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { signup } from "../service/serviceAPI";

const Register = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);

    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRedirect = () =>{
        navigate('/login');
    }

    useEffect(() => {
        userRef.current.focus();
    }, []);
    

    useEffect(()=>{
        setErrMsg('')
    }, [user]);

    useEffect(()=>{
        setErrMsg('');
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    const handleSubmit = async (e) =>{
        // e.preventDefault();
        console.log(name, user, pwd);
        const data = JSON.stringify({name: name, email: user, password: pwd, roles:[]});
        const response = await signup(data);
        if(response.status !== 200){
          setErrMsg("Username already in used! Try others!");
        }else{
          setSuccess(true);
        }
        
    }

  return (
    <>
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lg:inline-flex h-full text-white bg-black p-4">
        <div className="w-[450px] h-full bg-black px-10 flex flex-col gap-6 justify-center">
          <Link to="/home">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <IoBook size={50} className="h-8"/> 
            <span className=" self-center text-2xl font-semibold whitespace-nowrap">BookStore</span>
            </div>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Get started for free
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
            <Link to="/home">
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
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {success ? (
            <Result
                status = "success"
                title = "Register successful!"
                subtitle = "Sign In to continue"
                extra = {[
                    <Button type= "primary" key="signin" onClick={handleRedirect}>
                        Sign In
                    </Button>
                ]}
             />
        ):(
            <div className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <section className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">Register</h1>
            <Divider></Divider>
            <Form
                name="basic"
                labelCol={{span: 8,}}
                wrapperCol={{span: 50,}}
                className="max-w-2xl w-full mt-8 items-center text-center"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                 <Form.Item 
                    label="Name"
                    name="name"
                    id="name"
                    className="font-titleFont text-base font-semibold text-gray-600"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your name!',
                    }
                    ]}>
                        <Input 
                        onChange = {(e) => setName(e.target.value)}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        />
                </Form.Item>

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
                        ref = {userRef}
                        onChange = {(e) => setUser(e.target.value)}
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
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirm_pwd"
                    id="confirm_pwd"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if(!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The confirm password is not match'))
                            }
                        }),
                    ]}
                    className="font-titleFont text-base font-semibold text-gray-600"
                    >
                        <Input.Password 
                        onChange={(e)=> setMatchPwd(e.target.value)}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        />
                </Form.Item>

                <p ref={errRef} className={errMsg?"text-center text-red-500":"hidden"} aria-live="assertive">{errMsg}</p>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    
                    >
                    <Button type="primary" htmlType="submit" disabled={user==='' || !validMatch || pwd==='' ||name==='' ?true: false}
                    className="bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                    >
                        Sign Up
                    </Button>
                </Form.Item>

            </Form>
            <p className="mt-4 text-center">
                Already registered? <br />
                <span className="line">
                    <a onClick={handleRedirect} className="text-blue-500">Sign In</a>
                </span>
            </p>
        </section>
        </div>
        )}
        </div>
        </div>
    </>
  )
}

export default Register