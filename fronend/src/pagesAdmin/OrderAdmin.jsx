import { Table, Select, Modal, Button, Tag, Card, Descriptions, Image, Flex } from "antd";
import { useState, useEffect } from "react";
import { cancelOrderAdmin, getOrderByAdmin, updateDeliveryOrder } from "../service/serviceAPI";
import { defaultImg } from "../assets";

const columnsDetail = [
    {
        title: 'No',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text, record, index) => index + 1,
    },
    {
        title: "Book Cover",
        dataIndex: 'bookcover',
        key: 'bookcover',
        render: (_,record) =>{
            if(typeof record.bookcover !== "undefined"){
                return(
                    <div>
                        <Image
                            width={70}
                            src={"htttp://localhost:5555/uploads/"+record.bookcover}
                        />
                </div>
                )
            }else{
                return(
                    <div>
                        <Image
                            width={70}
                            src={defaultImg}
                        />
                    </div>
                )
                
            }
        }
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Authors',
        dataIndex: 'authors',
        key: 'authors'
    },
    {
        title: "Quantity",
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (_, record) => (
            <div>
            { record.discount && (Object.keys(record.discount).length === 0? (
                <span>{record.price}</span>
            ):(
                record.discount.status ? (
                        <span>
                            {record.price*(100-record.discount.discountNumber)/100}
                            <span className=" text-sm line-through ml-2 text-gray-400">{record.price}</span>
                            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
                                -{record.discount.discountNumber}%
                            </span>
                        </span>
                    ):(
                        <span>{record.price}</span>
                    )
                
            ))}
            </div>
        )
    }
]

const OrderAdmin = () =>{
    const [order, setOrder] = useState([]);
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState('blue');

    const[orderDetails, setOrderDetails] = useState({});
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState({});

    const handleOpenDetails = (record) =>{
        setOrderDetails({...record});
        setCart(record.cart);
        setAddress({...record.address});
        setOpen(true);
    }

    const handleStatusChange = async (value, record) =>{
        if(value === "On delivery"){
            const response = await updateDeliveryOrder({_id: record.key});
            if(response === 200){
                setOrder(response.data);
            }
        }
        if(value === "Cancel") {
            const response = await cancelOrderAdmin({_id: record.key});
            if(response === 200){
                setOrder(response.data);
            }
        }

    }

    const fetchData = async()=>{
        const response = await getOrderByAdmin();
        if(response.status === 200){
            setOrder(response.data);
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    const data = order.map((item,index)=>({
        key : item._id,
        total: item.totalPayment,
        status: item.status,
        address: {...item.address},
        cart: [...item.cart],
        totalitem: item.cart.length,
        shippingcharge: item.shippingcharge,
        subtotal: item.subtotal,
        userNote: item.userNote,
        available: item.available,
    }))

    const dataDetails = cart.map((book, index)=>({
        key: book._id,
        copyId: book.copyId._id,
        bookcover: book.copyId.imgURL,
        title: book.copyId.bookId.title,
        authors: book.copyId.bookId.authors.join(', '),
        quantity: book.quantity,
        price: book.copyId.price,
        discount: {...book.copyId.discount},
        inStock: book.copyId.inStock
    }))

    const changeColor = (status) =>{
        if(status === "On pending") return 'blue'
        if(status === "On delivery") return 'orange'
        if(status === "On waiting proccess") return 'cyan'
        if(status === "Cancel") return 'red'
        if(status === "Done") return 'green'
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
            title: "Address",
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <div onClick={()=> handleOpenDetails(record)}>
                    <p className="font-semibold">{record.address.name}</p>
                    {record.address.phoneNumber}<br/>
                    {record.address.address}, {record.address.ward}, {record.address.district}, {record.address.city}`
                </div>
            )
        },
        {
            title: 'Total items',
            dataIndex: 'totalitem',
            key: 'totalitem',
            align: 'center',
            render: (_, record) =>(
                <div onClick={()=> handleOpenDetails(record)}>{record.totalitem}</div>
            )
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'center'
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            render: (_, {status}) =>{
                return(
                    <Tag color={changeColor(status)}>{status}</Tag>
                )
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record)=>{
                    return(
                        <div>
                            <Select
                            defaultValue={record.status}
                            onChange={(value)=>handleStatusChange(value, record)}
                            disabled={record.status==="Done" || record.status==="Cancel"}
                            >
                                <Select.Option value="On pending" disabled={true}>On pending</Select.Option>
                                <Select.Option value="On delivery" disabled={record.status!== "On pending" && record.status!== "On waiting process"}>On delivery</Select.Option>
                                <Select.Option value="On waiting process" disabled={true}>On waiting process</Select.Option>
                                <Select.Option value="Cancel">Cancel</Select.Option>
                                <Select.Option value="Done" disabled={true} >Done</Select.Option>
                            </Select>
                        </div>
                    )
                
            }
        }
    ]

    return(
        <div>
             <div>
                <Card title="Orders" className='mt-4'>
                    <Table
                    columns={columns}
                    dataSource={data}
                     />
                </Card>
            </div>

            <Modal
            title="Order details"
            open={open}
            onCancel={()=>setOpen(false)}
            onOk={()=>setOpen(false)}
            width={1000}
            >
                <div>
                    <hr />
                    <div className="pt-5">
                        <Flex align="center" justify="flex-start">
                        <Tag color={changeColor(orderDetails.status)}
                        // style={{ fontSize: '16px', padding: '8px 12px' }}
                        >{orderDetails.status}</Tag>
                        </Flex>
                    </div>
                    <div className="pb-10 pt-5">
                        <Descriptions title="Address Information">
                            <Descriptions.Item label="Name">{address.name}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{address.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Address">{address.address}</Descriptions.Item>
                            <Descriptions.Item label="Ward">{address.ward}</Descriptions.Item>
                            <Descriptions.Item label="District">{address.district}</Descriptions.Item>
                            <Descriptions.Item label="City">{address.city}</Descriptions.Item>
                        </Descriptions>
                    </div>

                    { cart.length > 0 && (
                    <Table
                        columns={columnsDetail}
                        dataSource={dataDetails || []}
                        pagination={5}
                        scroll={{y: 240,}}
                        />
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default OrderAdmin;