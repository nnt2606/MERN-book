import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Descriptions } from 'antd';
import { addAddress, getAddress } from '../../service/serviceAPI';
import { useDispatch, useSelector } from 'react-redux';
import { changeAddress } from '../../redux/userSlice';

const UserAdress = () =>{
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');

    const currentAddress = useSelector((state)=>state.user.address);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data, setData] = useState({});

    const handleSubmit = async (value) =>{
        // const response = await addAddress({name: name, phoneNumber: phoneNumber, address: address, ward: ward, district: district, city: city});
        const response = await addAddress(value);
        if(response.status === 200){
            dispatch(changeAddress(value))
            navigate("/confirm")
        }
    }

    return(
        <div className='pl-10 pr-10'>
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
                <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                    Change Address
                </h1>
            </div>

            <div className="pb-10">
                    <Descriptions title="Address Information">
                        <Descriptions.Item label="Name">{currentAddress.name}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{currentAddress.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Address">{currentAddress.address}</Descriptions.Item>
                        <Descriptions.Item label="Ward">{currentAddress.ward}</Descriptions.Item>
                        <Descriptions.Item label="District">{currentAddress.district}</Descriptions.Item>
                        <Descriptions.Item label="City">{currentAddress.city}</Descriptions.Item>
                    </Descriptions>
                </div>

            <div>
            <Form
                    name="basic"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 50,}}
                    className="max-w-2xl w-full mt-8 items-center text-center pb-10"
                    onFinish={handleSubmit}
                    initialValues={{name}}
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
                            value={name}
                            onChange = {(e) => setName(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item 
                        label="Phone Number"
                        name="phoneNumber"
                        id="phoneNumber"
                        className="font-titleFont text-base font-semibold text-gray-600"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        }
                        ]}>
                            <Input 
                            value={phoneNumber}
                            onChange = {(e) => setPhoneNumber(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item 
                        label="Address"
                        name="address"
                        id="address"
                        className="font-titleFont text-base font-semibold text-gray-600"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your address!',
                        }
                        ]}>
                            <Input 
                            value={address}
                            onChange = {(e) => setAddress(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item 
                        label="Ward"
                        name="ward"
                        id="ward"
                        className="font-titleFont text-base font-semibold text-gray-600"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your ward!',
                        }
                        ]}>
                            <Input 
                            value={ward}
                            onChange = {(e) => setWard(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item 
                        label="District"
                        name="district"
                        id="district"
                        className="font-titleFont text-base font-semibold text-gray-600"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your district!',
                        }
                        ]}>
                            <Input 
                            value={ward}
                            onChange = {(e) => setDistrict(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item 
                        label="City"
                        name="city"
                        id="city"
                        className="font-titleFont text-base font-semibold text-gray-600"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your city!',
                        }
                        ]}>
                            <Input
                            value={city} 
                            onChange = {(e) => setCity(e.target.value)}
                            className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                            />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        
                        >
                        <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={name===''|| phoneNumber==='' || address===''|| ward===''|| district===''|| city==='' ?true: false}
                        className="bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                        >
                            Confirm
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </div>
    )
}

export default UserAdress;