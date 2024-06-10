import { Table, Image, Descriptions, Input, Button, Result } from "antd";
import { useState, useEffect } from "react";
import { createOrder, getAddress, getCart } from "../../service/serviceAPI";
import { defaultImg } from "../../assets";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { orderReducer } from "../../redux/userSlice";
const {TextArea} = Input;

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

const ConfirmOrder = () =>{
    const [cart, setCart] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [save, setSave] = useState(0);
    const [address, setAddress] = useState({});
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch();

    useEffect(()=>{
        fetchData();
    }, [])

    const fetchData = async () =>{
        const response = await getCart();
        if(response.data!==null){
            setCart([...response.data])
            caculateTotal(response.data)
        }

        const response2 = await getAddress();
        if(response2.data!== null){
            setAddress({...response2.data});
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
    const handleConfirm = async () =>{
        const response = await createOrder({userNote: note, subtotal: subtotal, discount: save, shippingcharge: 30000})
        if(response.status === 200){
            dispatch(orderReducer());
            setSuccess(true);
        }
    }
    

    const data = cart.map((book, index)=>({
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


    return(
        <div className="pl-10 pr-10" > 
            {success ? (
                <div>
                    <Result
                    status = "success"
                    title = "Order successful!"
                    subtitle = "Continue shopping"
                    extra = {[
                        <Link to="/home">
                        <Button type= "primary" key="home">
                            Home
                        </Button>
                        </Link>
              ]}
            />
                </div>
            ):(
            <div>
                <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
                    <h1 className="text-5xl text-black font-titleFont font-bold">
                        Confirm Order
                    </h1>
                </div>

                <div className="pb-10">
                    <Descriptions title="Address Information">
                        <Descriptions.Item label="Name">{address.name}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{address.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Address">{address.address}</Descriptions.Item>
                        <Descriptions.Item label="Ward">{address.ward}</Descriptions.Item>
                        <Descriptions.Item label="District">{address.district}</Descriptions.Item>
                        <Descriptions.Item label="City">{address.city}</Descriptions.Item>
                    </Descriptions>
                </div>

                <div>
                    <Table
                        columns={columns}
                        dataSource={data || []}
                        pagination={false}
                        />
                </div>

                <div className="pt-5 pl-10">
                    <p className="font-semibold pb-2">Note</p>
                    <TextArea
                    showCount
                    maxLength={100}
                    onChange={(e)=>setNote(e.target.value)}
                    style={{
                        width: 500,
                        resize: 'none',
                    }}
                    />
                </div>

                <div className="max-w-7xl gap-4 flex justify-end pb-5 pt-5">
                    <div className="w-96 flex flex-col gap-4 border-[1px] border-gray-400 py-1.5 px-4">
                        <p className="flex items-center justify-between text-sm ">
                            Subtotal
                            <span className="tracking-wide ">
                                {subtotal}$
                            </span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                            Save
                            <span className="tracking-wide text-gray-400">
                                -{save}$
                            </span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                            Shipping charge
                            <span className="tracking-wide">
                                {30000}$
                            </span>
                        </p>
                        <hr />
                        <p className="flex items-center justify-between text-lg font-semibold">
                            Total
                            <span className="tracking-wide text-lg">
                                {subtotal-save+30000}$
                            </span>
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl gap-4 flex justify-end pb-5 pt-5">
                    <Button onClick={handleConfirm}
                    className="w-52 h-10 bg-black text-white hover:bg-black duration-300"
                    >
                        Next
                    </Button>
                </div>
                
            </div>
            )}

        </div>
    )
}

export default ConfirmOrder;