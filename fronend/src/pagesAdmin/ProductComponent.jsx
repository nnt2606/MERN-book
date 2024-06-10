import React, { useEffect, useState } from 'react';
import { Space, Table, Card, Input, Button, Popconfirm, Modal, Form, Row, Col, InputNumber, Switch} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { createBook, createCopy, deleteBook, getBook, getCopy, updateBook, updateCopy } from '../service/serviceAPI';

const bookDetails = [
    {
        title: 'Title',
        key: 'title',
        type: 'Input',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Authors',
        key: 'authors',
        type: 'Input',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Genres',
        key: 'genre',
        type: 'Input',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title: 'Series',
        key: 'series',
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    }
]

const copyDetails = [
    {
        title:"ISBN",
        key: "ISBN",
        type: 'Input',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title:"Pages",
        key: "pages",
        type: 'Number',
        placeholder: '',
        required: false,
        rule: {}
    },
    {
        title:"Language",
        key: "Language",
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    },
    ,
    {
        title:"In Stock",
        key: "inStock",
        type: 'Number',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title:"Publish Year",
        key: "publishYear",
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    },
    {
        title:"Price",
        key: "price",
        type: 'Number',
        placeholder: '',
        required: true,
        rule: [{
            required: true,
            message: "This field isn't allow to blank"
        }]
    },
    {
        title:"Publisher",
        key: "publisher",
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    }
]

const ProductComponent = () =>{
    const [book, setBook] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { Search } = Input;

    const [open, setOpen] = useState(false);

    const [formBook] = Form.useForm();
    const [formCopy] = Form.useForm();
    const [selectedDataBook, setSelectedDataBook] = useState({});
    const [selectedDataCopy, setSelectedDataCopy] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isAddNew, setIsAddNew] = useState(false);

    const [isDisable, setIsDisable] = useState(true);
    const valuesBook = Form.useWatch([], formBook);
    const valuesCopy = Form.useWatch([], formCopy);


    const onOkModal = async () =>{
        await onHandleSubmit();
        setOpen(false)
    }

    const onCloseModal = () =>{
        setOpen(false)
        setIsEditable(false);
    }

    const onRowClick = async (record)=> {
        const response = await getCopy({bookId: record.key});
        setIsAddNew(false);
        setSelectedDataBook(record);
        setSelectedDataCopy(response.data);
        setOpen(true);
    };

    const handleDelete = async (record) =>{
        const response = await deleteBook({_id: record.key});
        if(response.status===200){
            fetchData();
        }
    }

    const handleAddNew = () =>{
        formBook.resetFields();
        formCopy.resetFields();
        setIsAddNew(true);
        setIsEditable(true);
        setOpen(true);
    }

    const onHandleSubmit = async () =>{
        const book = formBook.getFieldValue();
        const copy = formCopy.getFieldValue();
        if(isAddNew){
            const dataBook = {... book, authors: book.authors.split(', '), genre: book.genre.split(', ')}
            const response = await createBook(dataBook);
            if(response.status === 200){
                const bookId = response.data._id;
                const dataCopy = {
                    ...copy,
                    bookId: bookId
                }
                const response2 =  await createCopy(dataCopy);
                if(response2.status === 200){
                    fetchData();
                }
            }
        } else if(!isEditable){
            const dataBook = {... book, authors: book.authors.split(', '), genre: book.genre.split(', '), _id: book.key}
            const res1 = await updateBook(dataBook);
            if(res1.status === 200){
                const dataCopy = {
                    ...copy,
                    bookId: res1.data._id
                }
                const res2 = await updateCopy(dataCopy);
                if(res2.status===200){
                    fetchData();
                    setIsEditable(false);
                }
            }
            
        }
    }

    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') {
        setSearchText(e.target.value);
        }
    };

    const fetchData = async()=>{
        const response = await getBook();
        if(response.data !== null){
            setBook(response.data);
        }
    }

    useEffect(() => {
          fetchData();
    }, [])

    useEffect(()=>{
        if (selectedDataBook) {
            formBook.setFieldsValue(selectedDataBook);
        }
        if (selectedDataCopy) {
            formCopy.setFieldsValue(selectedDataCopy);
        }
    }, [selectedDataBook, selectedDataCopy])

    useEffect(()=>{
        formBook.validateFields({
            validateOnly:true,
        })
        .then(()=>{
            formCopy.validateFields({
                validateOnly:true,
            }).
            then(()=> setIsDisable(false))
            .catch(()=> setIsDisable(true))
        })
        .catch(()=>setIsDisable(true))
    }, [formBook.isFieldTouched, formCopy])
   

    const dataSource = book.map((data,index) => ({
    key: data._id,
    title: data.title,
    authors: data.authors.join(', '),
    genre: data.genre.join(', '),
    }))

    const filteredDataSource = searchText
    ? dataSource.filter(
        (item) =>
          (item && item.title.toLowerCase().includes(searchText.toLowerCase())) ||
          (item && item.authors.toLowerCase().includes(searchText.toLowerCase()))
      )
    : dataSource;

    const columns = [
        {
            title: 'No',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Authors',
            dataIndex: 'authors',
            key: 'authors',
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) =>(
                <Space size='middle'>
                    <EditOutlined style={{ fontSize: '16px', color: 'green' }}
                    onClick={()=> onRowClick(record)}
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
        },
    ]
    

    return(
        <div>
            <Card title="Products" className='mt-4'>
                <div className='mb-6' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Search placeholder='Input search text'
                            allowClear
                            style={{
                                width: 400,
                              }}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleEnterSearch}
                     />
                     <div>
                    <Button type='primary' style={{ marginRight: '20px', textAlign: 'right' }} onClick={handleAddNew}>Add new</Button>
                    </div>
                </div>
                { book.length > 0 &&(
                    <Table 
                    columns={columns} 
                    dataSource={filteredDataSource|| []}
                    pagination={{ pageSize: 10}}
                    />
                )}
            </Card>

            <Modal title="Information"
            open={open}
            onCancel={onCloseModal}
            width={1000}
            footer={ 
                <div>
                      {isEditable && (<Button
                        key="update"
                        type="primary"
                        htmlType='submit'
                        onClick={onOkModal}
                        disabled={isDisable}
                      >
                        Save
                      </Button>
                    )}
                      ,
                      <Button
                        key="close"
                        type="primary"
                        onClick={onCloseModal}
                      >
                        Close
                      </Button>,
                      </div>
                }
            >
                <div>{ !isAddNew &&(
                    <Switch defaultChecked={false} onChange={()=>setIsEditable(!isEditable)}/>
                )}
                </div>
                <div>
                    {/* <h1 className='pl-10 text-xl font-semibold underline pb-5'>Book</h1> */}
                    <Form
                    id='formBook'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={formBook}
                    layout='horizontal'
                    onFinish={onHandleSubmit}
                    autoComplete='off'
                    >
                        <Row gutter={16}>
                        {bookDetails.map((item)=>{
                            return(
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                    key={item.key}
                                    label={item.title}
                                    name={item.key}
                                    required={item.required}
                                    rules={item.rule}
                                    >
                                        <Input
                                        placeholder={item.placeholder}
                                        disabled={!isEditable}
                                        />
                                    </Form.Item>
                                </Col>
                            )
                        })}
                        </Row>
                    </Form>
                </div>

                
                <div className='pt-5'>
                    {/* <h1 className='pl-10 text-xl font-semibold underline pb-5'>Copy</h1> */}
                    <Form
                    id='formCopy'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={formCopy}
                    layout='horizontal'
                    onFinish={onHandleSubmit}
                    autoComplete='off'
                    >
                        <Row gutter={16}>
                        {copyDetails.map((item)=>{
                            switch(item.type){
                                case 'Input':
                                    return(
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                            key={item.key}
                                            label={item.title}
                                            name={item.key}
                                            required={item.required}
                                            rules={item.rule}
                                            >
                                                <Input
                                                placeholder={item.placeholder}
                                                disabled={!isEditable}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )
                                case 'Number':
                                    return(
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                            key={item.key}
                                            label={item.title}
                                            name={item.key}
                                            required={item.required}
                                            rules={item.rule}
                                            >
                                                <InputNumber min={0}
                                                placeholder={item.placeholder}
                                                disabled={!isEditable}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )
                            }
                        })}
                        </Row>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}

export default ProductComponent