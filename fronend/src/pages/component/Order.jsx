import { Empty, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getOrderByUser } from "../../service/serviceAPI";
import { Link, Navigate, useNavigate } from "react-router-dom";

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
        render: (_, {address}) => (
            <div>
                <p className="font-semibold">{address.name}</p>
                {address.phoneNumber}<br/>
                {address.address}, {address.ward}, {address.district}, {address.city}`
            </div>
        )
    },
    {
        title: 'Total items',
        dataIndex: 'totalitem',
        key: 'totalitem',
        align: 'center'
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
            let color=''
            if(status === "On pending") color= 'blue'
            if(status === "On delivery") color= 'orange'
            if(status === "On waiting proccess") color='cyan'
            if(status === "Cancel") color='red'
            if(status === "Done") color='green'

            return(
                <Tag color={color}>{status}</Tag>
            )
        }
    }
]

const Order = () =>{
    const [order, setOrder] = useState([]);
    const [check, setCheck] = useState(true);

    const navigate = useNavigate();

    const fetchData = async()=>{
        const response = await getOrderByUser();
        if(response.data.length > 0){
            setOrder(response.data);
        }else{
            setCheck(false);
        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

    const data = order.map((item,index)=>({
        key : item._id,
        total: item.totalPayment,
        status: item.status,
        address: {...item.address},
        totalitem: item.cart.length
    }))

    return(
        <div className="pl-10 pr-10">
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
                <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                    Order
                </h1>
            </div>

            {check? (
                <div>
                    <Table
                    columns={columns}
                    dataSource={data}
                    onRow={(record)=>{
                        return{
                            onClick: () =>{ navigate(`/order/${record.key}`, {state: {record}})}
                        }
                    }}
                     />

                </div>
            ):(
                <div className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20">
                <Empty description=""/>
                <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
                    <h1 className="font-titleFont text-xl font-bold uppercase">
                    Your don't have shopping history
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
    )
}

export default Order;