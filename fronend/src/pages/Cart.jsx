import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, Empty, Table, InputNumber, Image,Button, Popconfirm} from "antd";
import { Link } from "react-router-dom";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { useEffect, useState } from "react";
import { deleteCart, getCart } from "../service/serviceAPI";
import { defaultImg } from "../assets";
import { updateCart } from "../service/serviceAPI";
import { deleteCartReducer } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import ButtonDesgin from "../designLayout/ButtonDesign";
import { formatNumber } from "../const/utils";


const Cart = () =>{
    // const cartT = useSelector((state)=>state.user.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartNumber = useSelector((state)=>state.user.cartNumber);
    const [cart, setCart] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [save, setSave] = useState(0);
    const address = useSelector((state)=>state.user.address);

    useEffect(()=>{
        fetchData();
    }, [])

    const fetchData = async () =>{
        const response = await getCart();
        if(response.data!==null){
            setCart([...response.data])
            caculateTotal(response.data)
        }
        
    }

    const caculateTotal = (item)=>{
        const total = item.reduce((acc, item) => {
            return acc + (item.copyId.price * item.quantity);
          }, 0);
        const save = item.reduce((acc, item) =>{
            if(typeof item.copyId.discount === 'undefined'){
                return acc;
            }else{
                if(item.copyId.discount.status){
                    return acc + (item.copyId.price * item.quantity * item.copyId.discount.discountNumber/100);
                }else{
                    return acc;
                }
            }
        },0);
        setSave(save);
        setSubtotal(total);
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

    const handleQuantityChange = async (value,record) =>{
        console.log(value);
        const response = await updateCart({copyId: record.copyId, quantity: value});
        if(response !== null){
            setCart([...response.data]);
            caculateTotal(response.data);
        }
        fetchData();
    }

    const handleDelete = async (record) =>{
        const response = await deleteCart({copyId: record.copyId})
        if(response.data!== null){
            dispatch(deleteCartReducer({length: response.data.length}))
            setCart([...response.data]);
            caculateTotal(response.data);
        }
        fetchData();
    }

    const handleConfirmCart = () =>{
        if(Object.keys(address).length >0){
        navigate("/confirm");
        }else{
            navigate("/address");
        }
    }

    const columns = [
        {
            title:<span className="text-orange font-semibold">No</span> ,
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: <span className="text-orange font-semibold">Book Cover</span>,
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
            title: <span className="text-orange font-semibold">Title</span>,
            dataIndex: 'title',
            key: 'title',
            render: (_, record)=>(
                <div onClick={()=>navigate(`/book/${record.key}`, {state: {record}})} className=" cursor-pointer">{record.title}</div>
            )
        },
        {
            title: <span className="text-orange font-semibold">Authors</span>,
            dataIndex: 'authors',
            key: 'authors'
        },
        {
            title: <span className="text-orange font-semibold">Quantity</span>,
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (_, record)=>(
                <InputNumber 
                min={1} 
                max={record.inStock} 
                onChange={(value)=>{handleQuantityChange(value,record)}}
                defaultValue={record.quantity}
                />
            )
        },
        {
            title: <span className="text-orange font-semibold">Price</span>,
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
        },
        {
            title:<span className="text-orange font-semibold">Action</span>,
            key: 'action',
            align: 'center',
            render: (_, record) =>(
                <Popconfirm
                    title="Delete the book"
                    description="Are you sure to delete this book?"
                    onConfirm={() => handleDelete(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined 
                    style={{ fontSize: '16px', color: 'red' }}
                    />
                </Popconfirm>
            )
        }
    ]

    return(
        <div className="max-w-container mx-auto p-5">

            <div className="pr-5 pl-5">
                {cart.length > 0?(
                    <div className="pb-5">
                        <div>
                            <Table
                            columns={columns}
                            dataSource={data || []}
                            pagination={false}
                            />
                        </div>

                        <div className="max-w-7xl gap-4 flex justify-end pb-5 pt-5">
                            <div className="w-96 flex flex-col gap-4 border-[1px] border-gray-400 py-1.5 px-4">
                                <p className="flex items-center justify-between text-sm ">
                                    Subtotal
                                    <span className="tracking-wide ">
                                        {formatNumber(subtotal)}đ
                                    </span>
                                </p>
                                <p className="flex items-center justify-between text-sm">
                                    Save
                                    <span className="tracking-wide text-gray-400">
                                        -{formatNumber(save)}đ
                                    </span>
                                </p>
                                <p className="flex items-center justify-between text-sm">
                                    Shipping charge
                                    <span className="tracking-wide">
                                        {formatNumber(30000)}đ
                                    </span>
                                </p>
                                <hr />
                                <p className="flex items-center justify-between text-lg font-semibold">
                                    Total
                                    <span className="tracking-wide text-lg">
                                        {formatNumber(subtotal-save+30000)}đ
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">      
                            <button onClick={handleConfirmCart}
                            className="w-52 h-10 bg-grayColor text-black hover:bg-black hover:text-grayColor border-orange rounded border-[2px] duration-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ):(
                    <div className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20">
                        <Empty description=""/>
                        <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
                            <h1 className="font-titleFont text-xl font-bold uppercase">
                            Your Cart feels lonely.
                            </h1>
                            <p className="text-sm text-center px-10 -mt-2">
                            Your Shopping cart lives to serve. Give it purpose - fill it with
                            books and make it happy.
                            </p>
                            <Link to="/shop">
                            <button className="bg-black rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                                Continue Shopping
                            </button>
                            </Link>
                        </div>
                    </div>
                    
                )}
            </div>

        </div>
    )

}

export default Cart;