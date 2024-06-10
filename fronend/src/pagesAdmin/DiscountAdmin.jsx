import { Table, Tag, Card } from "antd";
import { useEffect, useState } from "react";
import { getAllDiscount } from "../service/serviceAPI";

const columns = [
    {
        title: 'No',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Discount percentage',
        dataIndex: 'discountNumber',
        key: 'discountNumber',
        align: 'center'
    },
    {
        title: "Start time",
        dataIndex: 'startAt',
        key: 'startAt'
    },
    {
        title: "End time",
        dataIndex: 'endAt',
        key: 'endAt',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (_, record) =>{
            if(record.status){
                return(
                    <Tag color="green">Available</Tag>
                )
            }else{
                return(
                    <Tag color="red">Not available</Tag>
                )
            }
        }
        
    }
]

const formatUtcDate = (utcDateString) => {
    // Parse the UTC date string into a Date object
    const date = new Date(utcDateString);
  
    // Extract the date components
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
  
    // Format the date string
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
  
    return formattedDate;
  }

const DiscountAdmin = () =>{
    const [discountList, setDiscountList]  = useState([]);

    const fetchData = async ()=>{
        const response = await getAllDiscount();
        if(response.status === 200){
            setDiscountList(response.data);
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    const data = discountList.map((item, index)=>({
        key: item._id,
        discountNumber: item.discountNumber,
        startAt: formatUtcDate(item.startAt),
        endAt: formatUtcDate(item.endAt),
        status: item.status
    }))

    return(
        <div>
            <Card title="Discount list" className='mt-4'>
                    <Table
                    columns={columns}
                    dataSource={data}
                     />
                </Card>
        </div>
    )
}

export default DiscountAdmin;