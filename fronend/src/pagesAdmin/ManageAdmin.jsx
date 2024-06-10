import { Table, Empty, Tag, Card, Button, Flex, Form, Modal, Row, Input, Checkbox, Col } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, signupAdmin } from "../service/serviceAPI";

const register = [
    {
        title: 'Name',
        key: 'name',
        required: true,
        type: 'Input',
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Username',
        key: 'username',
        required: true,
        type: 'Input',
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Password',
        key: 'pwd',
        type: 'Password',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Confirm Password',
        key: 'confirmPwd',
        type: 'Password',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        },
        ({getFieldValue}) => ({
            validator(_, value) {
                if(!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('The confirm password is not match'))
            }
        }),
    ]
    },
    {
        title: 'User',
        key: 'user',
        type: 'Checkbox',
        default: true,
        disabled: true,
        required: false,
        rule: {}
    },
    {
        title: 'Admin',
        key: 'admin',
        type: 'Checkbox',
        default: true,
        disabled: true,
        required: false,
        rule: {}
    },
    {
        title: 'SuperAdmin',
        key: 'superadmin',
        type: 'Checkbox',
        required: false,
        default: false,
        disabled: false,
        rule: {}
    }
]

const ManageAdmin = () =>{
    const isSuperadmin = useSelector((state) => state.auth.isSuperadmin);
    const [listAdmin, setListAdmin] = useState([]);
    const [open, setOpen] = useState(false);

    const [formRegister] = Form.useForm();
    const [errMsg, setErrMsg] = useState('');

    const dispatch= useDispatch();

    const handleOk = () =>{
        formRegister.submit();
    }

    const handleCreateAccount = async (value) =>{
        if(
            typeof value.name === 'undefined'
            || typeof value.username === 'undefined'
            || typeof value.pwd === 'undefined'
            || typeof value.confirmPwd === 'undefined'
        ){
            setErrMsg('Required fields is not null')
        } else if(
            value.pwd !== value.confirmPwd
        ){
            setErrMsg('Password and confirm password is not same')
        } else{
            if(value.superadmin === true){
                const response = await signupAdmin({name: value.name, email: value.username, password: value.pwd, roles: ['admin', 'superadmin']});
                if(response.status === 200){
                    setListAdmin(response.data);
                    setOpen(false);
                }
            }else{
                const response = await signupAdmin({name: value.name, email: value.username, password: value.pwd, roles: ['admin']});
                if(response.status === 200){
                    setListAdmin(response.data);
                    setOpen(false);
                }
            }
        }

    }

    const handleAddNew = () =>{
        setOpen(true);
        setErrMsg('');
        formRegister.resetFields();
    }

    const fetchData = async () =>{
        const response = await getAdmin();
        if(response.status === 200){
            setListAdmin(response.data);
        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

    const changeColor = (value) =>{
        if(value === 'User') return 'default';
        if(value === 'Admin') return 'gold';
        if(value === 'SuperAdmin') return 'magenta';
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (_, record) =>(
                <>
                {Object.keys(record.roles).map((key) => (
                  <Tag color={changeColor(key)} key={key}>
                    {key}
                  </Tag>
                ))}
              </>
            )
        }
    ]

    const data = listAdmin.map((admin, index)=>({
        key: admin._id,
        name: admin.name,
        username: admin.email,
        roles: {...admin.roles},
    }))

    return(
        <div className="pt-5">
            {isSuperadmin? (
                <div>
                    <Card title = "List of admin">
                        <Flex align="center" justify="flex-end" className="pb-5">
                        <Button type='primary' style={{ marginRight: '20px', textAlign: 'right' }} onClick={handleAddNew}>Add new</Button>
                        </Flex>

                        <Table
                        columns={columns}
                        dataSource={data || []}
                         />
                    </Card>
                </div>
            ):(
                <div className="pt-[100px]">
                    <Empty description="You don't have role to access this" />
                </div>
            )}

            <Modal title="Add new admin"
            open={open}
            onCancel={()=>setOpen(false)}
            onOk={handleOk}
            // width={800}
             >
                <Form
                id='form'
                className="max-w-2xl w-full mt-8 items-center text-center pr-10"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout='horizontal'
                autoComplete='off'
                onFinish={handleCreateAccount}
                form = {formRegister}
                >
                    {/* <Row gutter={16}> */}
                    {register.map((item)=>{
                        switch(item.type){
                            case 'Input':
                                return(
                                        <Form.Item
                                        key={item.key}
                                        label={item.title}
                                        name={item.key}
                                        required={item.required}
                                        rule={item.rule}
                                        className="font-titleFont text-base font-semibold text-gray-600"
                                        >
                                            <Input
                                            // className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                                            />
                                        </Form.Item>
                                )
                            case 'Password':
                                return(
                                        <Form.Item
                                        key={item.key}
                                        label={item.title}
                                        name={item.key}
                                        required={item.required}
                                        rule={item.rule}
                                        className="font-titleFont text-base font-semibold text-gray-600"
                                        >
                                            <Input.Password
                                            // className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                                            />
                                        </Form.Item>
                                )
                            case 'Checkbox':
                                return(
                                    // <Col xs={24} sm={12}>
                                        <Form.Item
                                        key={item.key}
                                        label={item.title}
                                        name={item.key}
                                        required={item.required}
                                        rule={item.rule}
                                        valuePropName="checked"
                                        wrapperCol={{ offset: 8, span: 16 }}
                                        >
                                            <Checkbox defaultChecked={item.default} disabled={item.disabled}/>
                                        </Form.Item>
                                        // </Col>
                                )
                        }

                        
                    })}
                    {/* </Row> */}
                </Form>

                <p className={errMsg?"text-center text-red-500":"hidden"} aria-live="assertive">{errMsg}</p>
            </Modal>
        </div>
    )
}

export default ManageAdmin;