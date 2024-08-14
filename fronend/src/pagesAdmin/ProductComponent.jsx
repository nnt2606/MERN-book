import React, { useEffect, useState } from 'react';
import { Space, Table, Card, Input, Button, Popconfirm, 
    Modal, Form, Row, Col, InputNumber, Switch, Pagination, TreeSelect, Select, Tag} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { createBook, createCopy, deleteBook, getAllCopy, search, getCopy, updateBook, updateCopy, getGenre, getAllDiscount, addDiscount } from '../service/serviceAPI';
import { capitalizeFirstLetter, formatNumber, formatUtcDate } from "../const/utils";
const { SHOW_PARENT } = TreeSelect;

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
        type: 'Select',
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
        title:"Format",
        key: "format",
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
        title:"Publish Year",
        key: "publishYear",
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    },
   
    {
        title:"Publisher",
        key: "publisher",
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    }, 
    {
        title: "Image URL",
        key: 'imgURL',
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    },
    {
        title: "Description",
        key: "description",
        type: "Textarea",
        placeholder: '',
        required: false,
        rule: {},
    },
    {
        title: "Discount",
        key: 'discountNumber',
        type: 'Input',
        placeholder: '',
        required: false,
        rule: {}
    }
]

const discountTable = [
    {
        title: 'Discount percentage',
        dataIndex: 'discountNumber',
        key: 'discountNumber',
        align: 'center',
    },
    {
        title: "Start time",
        dataIndex: 'startAt',
        key: 'startAt',
        render: (_,record)=>(
            <div>{formatUtcDate(record.startAt)}</div>
        )
    },
    {
        title: "End time",
        dataIndex: 'endAt',
        key: 'endAt',
        render: (_, record) =>(
            <div>{formatUtcDate(record.endAt)}</div>
        )
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

    const [page, setPage] = useState(1);
    const [totalItem, setTotalItem] = useState(1);
    const [isSearch, setIsSearch ] = useState(false);
    const [listSelect, setListSelect] = useState([]);
    const [valueselect, setValueSelect] = useState();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [openDiscountModal, setOpenDiscountModal] = useState(false);
    const [discountList, setDiscountList]  = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState();                                           

    const [sort, setSort] = useState('new');

    const onSelectChange = (newSelectedRowKeys) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
      };

    const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    };

    const onSelectDiscountChange = (select) =>{
        //console.log('selectedRowKeys changed: ', select);
        setSelectedDiscount(select[0]);
    }
    
    const rowDiscountSelect = {
        type: 'radio',
        selectedRowKeys: selectedDiscount ? [selectedDiscount] : [],
        onChange: onSelectDiscountChange,
    }

    const handleAddDiscountButton = async () =>{
        //console.log(selectedRowKeys);
        await fetchDataDiscount();
        setSelectedDiscount();
        setOpenDiscountModal(true);
    }

    const handleAddDiscount = async () =>{
        console.log(selectedDiscount);
        console.log(selectedRowKeys);
        const  response = await addDiscount({discountId: selectedDiscount, copyId: selectedRowKeys});
        if(response.status === 200){
            setSelectedRowKeys([]);
            setSelectedDiscount();
        }
        setOpenDiscountModal(false);
    }


    const onOkModal = async () =>{
        await onHandleSubmit();
        setOpen(false)
    }

    const onCloseModal = () =>{
        setOpen(false)
        setIsEditable(false);
    }

    const onRowClick = async (record)=> {
        const response = await getCopy({bookId: record.bookId});
        setIsAddNew(false);
        setSelectedDataBook(response.data.bookId);
        setSelectedDataCopy({
            discountNumber: typeof response.data.discount === 'undefined'? "Not available": (response.data.discount.status === true? "Available": "Not available"),
            ...response.data});
        setOpen(true);
    }

    const handleDelete = async (record) =>{
        const response = await deleteBook({_id: record.bookId});
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
        // console.log(book.genre);
        if(isAddNew){
            const dataBook = {... book, authors: book.authors.split(', '), genre: book.genre}
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
        setSearchText(e);
        setPage(1);
        setIsSearch(true);
        fetchDataWithSearch(1, JSON.stringify({searchValue: e}));
    };

    const handleChange = (value) =>{
        setPage(1);
        setSort(value);
        if(isSearch){
            fetchDataWithSearch(1, JSON.stringify({searchValue: searchText, selectValue: valueselect, sort: value}));
        }else{
            fetchData(1 , {sort: value});
        }
    }

    const handleCancelSearch = () =>{
        setPage(1);
        setIsSearch(false);
        fetchData(1);
    }

    const onPaginationChange = (value) =>{
        console.log(value);
        setPage(value)
        if(isSearch || sort!== 'new'){
            fetchDataWithSearch(value, JSON.stringify({searchValue: searchText, sort: sort}));
        }else{
            fetchData(value);
        }
    }

    const fetchData = async(pages, data)=>{
        const response = await getAllCopy(`?page=${pages}&limit=${10}`, data);
        if(response.status === 200){
            setBook(response.data.listCopy);
            setTotalItem(response.data.totalRecords)
        }
    }

    const fetchDataWithSearch = async(pages,data) =>{
        const response = await search(`?page=${pages}&limit=${10}`, data);
        if(response.status === 200){
            setBook([...response.data.listCopy])
            setTotalItem(response.data.totalRecords)
        }
    }

    const fetchDataSelect = async () =>{
        const response = await getGenre();
        if(response.status === 200){
            setListSelect([...response.data])
        }
    }

    const fetchDataDiscount = async () =>{
        const response = await getAllDiscount();
        if(response.status === 200){
            setDiscountList(response.data);
        }
    }

    useEffect(() => {
          fetchData(1);
          fetchDataSelect();
    }, [])

    useEffect(()=>{
        if (selectedDataBook) {
            formBook.setFieldsValue(selectedDataBook);
        }
        if (selectedDataCopy) {
            formCopy.setFieldsValue(selectedDataCopy);
        }
    }, [selectedDataBook, selectedDataCopy])

    const handleValuesChange = () => {
        // Validate fields on any value change
        formBook
          .validateFields()
          .then(() => {
            setIsDisable(false);
          })
          .catch(() => {
            setIsDisable(true);
          });
          formCopy
          .validateFields()
          .then(() => {
            setIsDisable(false);
          })
          .catch(() => {
            setIsDisable(true);
          });
      };
   

    const dataProduct = book.map((book, index)=>({
        key: book._id,
        bookId: book.bookId._id,
        title: book.bookId.title,
        img: book.imgURL,
        authors: book.bookId.authors.join(', '),
        genre: book.bookId.genre.map(capitalizeFirstLetter).join(', '),
        series: book.bookId.series,
        price: book.price,
        sold: book.sold,
        inStock: book.inStock,
        discount: {...book.discount},
    }))

    const treeDataSelect = listSelect.map(item=>({
        key: item,
        value: item,
        title: item.charAt(0).toUpperCase() + item.slice(1)
    }))

    const columns = [
        {
            title: 'Image',
            key: 'img',
            render: (_,record) => <img src={record.img} width={70}/>
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
            title: 'Genres',
            dataIndex: 'genre',
            key: 'genre',
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
        },
        {
            title: 'In Stock',
            dataIndex: 'inStock',
            key: 'inStock',
            align: 'center',
            render: (_, record)=>{
                if(record.inStock ===0){
                    return(
                        <div className='text-red-800 font-semibold'>Out of stock</div>
                    )
                }else{
                    return(
                        <div>{record.inStock}</div>
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
                <div className='mb-6'>
                    <Search placeholder='Input search text'
                            allowClear
                            style={{
                                width: 400,
                              }}
                            onSearch={handleEnterSearch}
                            onClear={handleCancelSearch}
                     />{
                        searchText &&(
                            <div>Searching: <span className='font-semibold text-lg'>{searchText}</span></div>
                        )
                     }

                    <Select     value={sort}
                                onChange={handleChange}
                                style={{width: "150px"}}
                                options={[
                                    {value: "new", label: "Newest"},
                                    {value: "best", label: "Best seller"},
                                    {value: "low", label: "Low to High price"},
                                    {value: "high", label: "High to Low price"},
                                    {value: "stock", label: "Sort by stock"}
                                ]}
                                className='mx-4'
                        />

                     <div className='pt-5'>
                    <Button type='primary' style={{ marginRight: '20px', textAlign: 'right' }} onClick={handleAddNew}>Add new</Button>
                    <Button type='primary' style={{ marginRight: '20px', textAlign: 'right' }} onClick={handleAddDiscountButton} disabled={!selectedRowKeys.length>0}>Add Discount</Button>
                    </div>

                </div>
                { book.length > 0 &&(
                    <div>
                        <Table 
                        rowSelection={rowSelection}
                        columns={columns} 
                        dataSource={dataProduct|| []}
                        pagination={false}
                        >
                        </Table>
                        <Pagination 
                            className='py-10 px-10'
                            onChange={onPaginationChange}
                            current={page}
                            total={totalItem}
                            pageSize={10}
                            showSizeChanger={false}
                        />
                    </div>
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
                    onValuesChange={handleValuesChange}
                    >
                        <Row gutter={16}>
                        {bookDetails.map((item)=>{
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
                                case 'Select':
                                    return(
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                             key={item.key}
                                             label={item.title}
                                             name={item.key}
                                             required={item.required}
                                             rules={item.rule}
                                            >
                                                <TreeSelect className="w-full py-4"
                                                            treeData={treeDataSelect}
                                                            value={valueselect}
                                                            onChange={(value) => setValueSelect(value)}
                                                            treeCheckable={true}
                                                            showCheckedStrategy={SHOW_PARENT}
                                                            placeholder="Select genres"
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
                    onValuesChange={handleValuesChange}
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
                                                disabled={item.key==='discountNumber' ?true: !isEditable}
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
                                case 'Textarea':
                                    return(
                                        <Col xs={24} sm={12}>
                                        <Form.Item
                                        key={item.key}
                                        label={item.title}
                                        name={item.key}
                                        required={item.required}
                                        rules={item.rule}
                                        >
                                            <Input.TextArea disabled={!isEditable}
                                            placeholder={item.placeholder}
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

            <Modal
            title="Add discount"
            open={openDiscountModal}
            onCancel={()=>setOpenDiscountModal(false)}
            onOk={handleAddDiscount}
            width={800}
            >
                <div className='pb-5'>
                    Add discount to {selectedRowKeys.length} book selected
                </div>
                <Table
                rowSelection={rowDiscountSelect}
                columns={discountTable}
                dataSource={discountList.map((item) =>({
                    key: item._id,
                    ...item
                }))}
                />
            </Modal>
        </div>
    )
}

export default ProductComponent