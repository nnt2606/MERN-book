import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import { Descriptions, Table, Image, Tag, Button } from "antd";
import { cancelOrderUser, finishOrder, getOrderDetail } from "../../service/serviceAPI";
import { defaultImg } from "../../assets";
import { formatNumber } from "../../const/utils";

const OrderDetails = () =>{
    const orderId = useParams();
    const [order, setOrder] = useState({});
    const [color, setColor] = useState('magneta');
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    const fetchData = async()=>{
        const response = await getOrderDetail({_id: orderId});
        setOrder({...response.data});
        setCart([...response.data.cart]);
    }

    const changeColor = (status) =>{
        if(status === "On pending") return 'blue'
        if(status === "On delivery") return 'orange'
        if(status === "On waiting proccess") return 'cyan'
        if(status === "Cancel") return 'red'
        if(status === "Done") return 'green'
    }


    const data = cart.map((book, index)=>({
        key: book.copyId.bookId._id,
        copyId: book.copyId._id,
        bookcover: book.copyId.imgURL,
        title: book.copyId.bookId.title,
        authors: book.copyId.bookId.authors.join(', '),
        quantity: book.quantity,
        price: book.copyId.price,
        discount: {...book.copyId.discount},
        inStock: book.copyId.inStock
    }))

    const handleConfirm = async () =>{
        if(order.status === "On delivery"){
            const response = await finishOrder({_id: order._id});
            if(response.status === 200){
                setOrder(response.data);
            }
        }else{
            const response = await cancelOrderUser({_id: order._id});
            if(response.status === 200){
                setOrder(response.data);
            }
    }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    const columns = [
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
                                src={record.bookcover}
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
            render: (_, record) =>(
                <div onClick={()=>navigate(`/book/${record.key}`, {state: {record}})} className=" cursor-pointer">{record.title}</div>
            )
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
                    <span>{formatNumber(record.price)}</span>
                ):(
                    record.discount.status ? (
                            <span>
                                {record.price*(100-record.discount.discountNumber)/100}
                                <span className=" text-sm line-through ml-2 text-gray-400">{formatNumber(record.price)}</span>
                                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
                                    -{formatNumber(record.discount.discountNumber)}%
                                </span>
                            </span>
                        ):(
                            <span>{formatNumber(record.price)}</span>
                        )
                    
                ))}
                </div>
            )
        }
    ]

    return(
        <div className="pl-10 pr-10">
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
                <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                    Order Details
                    <span className="pl-10"><Tag color={changeColor(order.status)}>{order.status}</Tag></span>
                </h1>
            </div>
            {console.log(order)}
            
            {Object.keys(order).length > 0 &&(
                <div>
                    <div className="pb-10">
                        <Descriptions title="Address Information">
                            <Descriptions.Item label="Name">{order.address.name}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{order.address.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Address">{order.address.address}</Descriptions.Item>
                            <Descriptions.Item label="Ward">{order.address.ward}</Descriptions.Item>
                            <Descriptions.Item label="District">{order.address.district}</Descriptions.Item>
                            <Descriptions.Item label="City">{order.address.city}</Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div>
                        { cart.length>0 &&(
                            <Table
                                columns={columns}
                                dataSource={data || []}
                                pagination={false}
                                />)
                        }
                    </div>

                    <div className="max-w-7xl gap-4 flex justify-end pb-5 pt-5">
                        <div className="w-96 flex flex-col gap-4 border-[1px] border-gray-400 py-1.5 px-4">
                            <p className="flex items-center justify-between text-sm ">
                                Subtotal
                                <span className="tracking-wide ">
                                    {formatNumber(order.subtotal)}đ
                                </span>
                            </p>
                            <p className="flex items-center justify-between text-sm">
                                Save
                                <span className="tracking-wide text-gray-400">
                                    -{formatNumber(order.discount)}đ
                                </span>
                            </p>
                            <p className="flex items-center justify-between text-sm">
                                Shipping charge
                                <span className="tracking-wide">
                                    {formatNumber(order.shippingcharge)}đ
                                </span>
                            </p>
                            <hr />
                            <p className="flex items-center justify-between text-lg font-semibold">
                                Total
                                <span className="tracking-wide text-lg">
                                    {formatNumber(order.totalPayment)}đ
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="max-w-7xl gap-4 flex justify-end pb-5 pt-5">
                        <Button onClick={handleConfirm}
                        disabled={order.status !== "On pending" && order.status!== "On delivery"}
                        className = {`w-52 h-10 text-white duration-300 ${order.status === "On delivery"? 'bg-green-600': 'bg-red-600'}`}
                        >
                            {order.status==="On delivery" || order.status=== "Done" ? "Done" : "Cancel order"}
                        </Button>
                </div>
                </div>
            )}

        </div>
    )
}

export default OrderDetails