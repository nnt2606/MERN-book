import { Table, Tag, Space, Card,Popconfirm, Modal, Button, Form, Row, Col, InputNumber, DatePicker, Switch } from "antd";
import { useEffect, useState } from "react";
import { createDiscount, deleteDiscount, getAllDiscount, updateDiscount } from "../service/serviceAPI";
import { formatUtcDate } from "../const/utils";
import moment from 'moment';
import dayjs from "dayjs";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
const {RangePicker} = DatePicker;

const discountDetails = [
    {
        title: 'Discount Number (%)',
        key: 'discountNumber',
        type: 'Number',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Time',
        key: 'timedate',
        type: 'Date',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Status',
        key: 'status',
        type: 'Switch',
        required: false,
        rule: {}
    }
]

const DiscountAdmin = () =>{
    const [discountList, setDiscountList]  = useState([]);

    const [open, setOpen] = useState(false);
    const [formDiscount] = Form.useForm();
    const [dateRange, setDateRange] = useState([]);

    const [discountModal, setDiscountModal] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);
    const [discountId, setDiscountId] = useState('');

    const handleAddNewButton = () =>{
        formDiscount.resetFields();
        setIsUpdate(false)
        setOpen(true);
    }

    const handleSubmitModal = () =>{
        formDiscount.submit()
        setOpen(false)
    }

    const onCloseModal = () =>{
        setOpen(false);
    }

    const onHandleForm = async () =>{
        const discount = formDiscount.getFieldValue();
        const [startDate, endDate] = dateRange;
        console.log(dateRange);
        const utcStartDate = moment(startDate, 'DD/MM/YYYY').utc();
        const utcEndDate = moment(endDate, 'DD/MM/YYYY').utc();

        if(isUpdate){
            const response = await updateDiscount(JSON.stringify({
                _id: discountId,
                discountNumber: discount.discountNumber,
                startAt: utcStartDate,
                endAt: utcEndDate,
                status: typeof discount.status === 'undefined'? true: discount.status
            }))

            if(response.data!== null){
                await fetchData();
            }

        }else{
            const response = await createDiscount(JSON.stringify({
                discountNumber: discount.discountNumber,
                startAt: utcStartDate,
                endAt: utcEndDate,
                status: typeof discount.status === 'undefined'? true: discount.status
            }))
            if(response.data !== null){
                await fetchData();
            }
        }
       
    }

    const handleOpenDetails = (record) =>{
        setDiscountModal({...record});
        setIsUpdate(true);
        setDiscountId(record.key);
        setOpen(true);
    }

    const handleDelete = async (record) =>{
        const response = await deleteDiscount({_id: record.key});
        if(response.data !== null){
            await fetchData();
        }
    }

    const handleValuesChange = () => {
        // Validate fields on any value change
        formDiscount
          .validateFields()
      };

    const fetchData = async ()=>{
        const response = await getAllDiscount();
        if(response.status === 200){
            setDiscountList(response.data);
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    useEffect(()=>{
        formDiscount.setFieldsValue({
            ...discountModal,
            timedate: [ 
                dayjs(discountModal.startAt, 'DD/MM/YYYY'),
                dayjs(discountModal.endAt, 'DD/MM/YYYY')
                // discountModal.startAt, discountModal.endAt
                    ]
        });
        
    }, [discountModal])

    const data = discountList.map((item, index)=>({
        key: item._id,
        discountNumber: item.discountNumber,
        startAt: formatUtcDate(item.startAt),
        endAt: formatUtcDate(item.endAt),
        status: item.status
    }))

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
            align: 'center',
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
            
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) =>(
                <Space size='middle'>
                    <EditOutlined style={{ fontSize: '16px', color: 'green' }}
                    onClick={()=> handleOpenDetails(record)}
                    />
                    <Popconfirm title="Delete the book"
                                description="Are you sure to delete this book?"
                                onConfirm={() => handleDelete(record)}
                                okText="Yes"
                                cancelText="No">
                    <DeleteOutlined style={{ fontSize: '16px', color: 'red' }}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return(
        <div>
            <Card title="Discount list" className='mt-4'>
                <div>
                    <Button type="primary" style={{ marginRight: '20px', textAlign: 'right' }} onClick={handleAddNewButton}>Add new</Button>
                </div>
                    <Table
                    columns={columns}
                    dataSource={data}
                     />
            </Card>


            <Modal title="Discount details"
                   open={open}
                   onCancel={onCloseModal}
                   width={500}
                   footer={
                    <div>
                        <Button key="update"
                                type="primary"
                                htmlType="submit"
                                onClick={handleSubmitModal}
                                style={{marginRight: '10px'}}
                        >
                            Save
                        </Button>
                        <Button key="close"
                                type="primary"
                                onClick={onCloseModal}
                        >
                            Close
                        </Button>
                    </div>
                   }
            >
                <Form form={formDiscount}
                      id='formDiscount'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 16}}
                      autoComplete="off"
                      onFinish={onHandleForm}
                      onValuesChange={handleValuesChange}
                >
                        {discountDetails.map((item) => {
                            switch(item.type) {
                                case 'Number':
                                    return(

                                            <Form.Item  key={item.key}
                                                        label={item.title}
                                                        name={item.key}
                                                        required={item.required}
                                                        rules={item.rule}
                                            >
                                                <InputNumber min={0} max={100}
                                                placeholder={item.placeholder}
                                                />
                                            </Form.Item>

                                    )
                                case 'Date':
                                    return(
                                        <Form.Item  key={item.key}
                                                    label={item.title}
                                                    name={item.key}
                                                    required={item.required}
                                                    rules={item.rule}
                                        >
                                            <RangePicker onChange={(dates, dateString)=>setDateRange(dateString)} 
                                                         format='DD/MM/YYYY'
                                            />
                                        </Form.Item>
                                    )
                                case 'Switch':
                                    return(
                                        <Form.Item  key={item.key}
                                                    label={item.title}
                                                    name={item.key}
                                                    required={item.required}
                                                    rules={item.rule}
                                        >
                                            <Switch />       
                                        </Form.Item>
                                    )
                            }
                        })}
                </Form>
            </Modal>
        </div>
    )
}

export default DiscountAdmin;