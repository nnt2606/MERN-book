import React, { useEffect, useState } from "react";
import {Outlet, useNavigate } from "react-router-dom";
import {Breadcrumb, Pagination, Row, Col, Collapse, TreeSelect, InputNumber, Card, Button, Select} from 'antd';
import { useDispatch, useSelector } from "react-redux";
import {Input, Flex} from "antd";
import { getAllCopy, getBook, getGenre, search } from "../service/serviceAPI";
import ProductShow from "./component/ProductCard";
import { CiSearch } from "react-icons/ci";
const { SHOW_PARENT } = TreeSelect;

const Shop = () =>{
    const navigate = useNavigate();
    const [copy, setCopy] = useState([]);
    const [listSelect, setListSelect] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItem, setTotalItem] = useState(1);

    const [valueselect, setValueSelect] = useState();
    const [searchValue, setSearchValue] = useState();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const [sort, setSort] = useState('new');

    const [isSearch, setIsSearch] = useState(false);
    const query = `?page=${page}&limit=${24}`

    const handleChange = (value) =>{
        setSort(value);
        if(isSearch){
            fetchDataWithSearch(query, JSON.stringify({searchValue: searchValue, selectValue: valueselect, minPrice: minPrice, maxPrice: maxPrice, sort: value}));
        }else{
            fetchDataProduct(query, {sort: value});
        }
    }

    const onClearAll = () =>{
        setValueSelect();
        setSearchValue();
        setMaxPrice(0);
        setMinPrice(0);
        setIsSearch(false);
        setPage(1);
        setSort('new');
        fetchDataProduct(1, {sort: 'new'});
    }
    
    const onSearchButton = async ()=>{
        setPage(1);
        setIsSearch(true);
        fetchDataWithSearch(query, JSON.stringify({searchValue: searchValue, selectValue: valueselect, minPrice: minPrice, maxPrice: maxPrice, sort: sort}));
    }

    const onRowClick = (record) =>{
        navigate(`/book/${record.key}`, {state: {record}});
    }

    const onPaginationChange= (value) =>{
        setPage(value);
        if(isSearch){
            fetchDataWithSearch(value, JSON.stringify({searchValue: searchValue, selectValue: valueselect, minPrice: minPrice, maxPrice: maxPrice}))
        }else{
            fetchDataProduct(value, {sort: sort});
        }
        
    }

    const fetchDataWithSearch = async(pages,data) =>{
        const response = await search(`?page=${pages}&limit=${24}`, data);
        if(response.status === 200){
            setCopy([...response.data.listCopy])
            setTotalItem(response.data.totalRecords)
        }
    }

    const fetchDataSelect = async () =>{
        const response = await getGenre();
        if(response.status === 200){
            setListSelect([...response.data])
        }
    }

    const fetchDataProduct = async (pages, data) =>{
        const response  = await getAllCopy(`?page=${pages}&limit=${24}`, data);
        if(response.status === 200){
            setCopy([...response.data.listCopy])
            setTotalItem(response.data.totalRecords)
        }
    }

    useEffect(()=>{
        fetchDataSelect();
        fetchDataProduct(page, {sort: sort});
    },[])

    const dataProduct = copy.map((book, index)=>({
        key: book.bookId._id,
        title: book.bookId.title,
        img: book.imgURL,
        authors: book.bookId.authors.join(', '),
        price: book.price,
        sold: book.sold,
        inStock: book.inStock
    }))

    const treeDataSelect = listSelect.map(item=>({
        key: item,
        value: item,
        title: item.charAt(0).toUpperCase() + item.slice(1)
    }))

    return(
        <div className="max-w-container mx-auto px-14 py-5">
           <Row gutter={[16, 16]}>
                <Col span={6} xs={24} md={24} sm={24} lg={6}>
                    <Card title="Search" bordered={false}>
                    <div className="pt-3 ">
                        <Input placeholder="Searching book by name" prefix={<CiSearch />} value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} allowClear/>

                        <TreeSelect className="w-full py-4"
                                    treeData={treeDataSelect}
                                    value={valueselect}
                                    onChange={(value) => setValueSelect(value)}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    placeholder="Select genres"
                        />

                        <div>
                            <span className="font-semibold">Price:</span>
                            <span className="mx-1">from</span>
                            <span><InputNumber placeholder="min" value={minPrice} onChange={setMinPrice}/></span>
                            <span className="mx-1">to</span>
                            <span><InputNumber placeholder="max" value={maxPrice} onChange={setMaxPrice}/></span>
                        </div>
                    </div>

                    <Flex justify="flex-end" align="center" className="mx-5">
                        <button onClick={onSearchButton}
                                className="mx-2 my-5 bg-grayColor text-black border-[3px] border-orange rounded-lg w-[100px] h-[40px] hover:border-grayColor hover:text-white hover:bg-black font-semibold"
                        >  
                            Searching
                        </button>
                        <button onClick={onClearAll}
                                className="mx-2 my-5 bg-grayColor text-black border-[3px] border-orange rounded-lg w-[100px] h-[40px] hover:border-grayColor hover:text-white hover:bg-black font-semibold"
                        >
                            Clear all
                        </button>
                    </Flex>
                    </Card>
                </Col>

                <Col span={18} xs={24} md={24} sm={24} lg={18}>
                <div className="w-full h-full flex flex-col pb-20 gap-10 mdl:flex-row mdl:pb-0">
                    <div className="w-full sml:w-[100%] mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-5 order-none">
                        <div className="text-lg">
                            {isSearch &&(
                                <span className="pl-5">
                                    <span className="font-semibold">Research:</span>
                                    <span className="mx-3">{searchValue}</span>
                                </span>
                            )}

                            <div className="absolute right-[50px]">
                                <Select 
                                        value={sort}
                                        onChange={handleChange}
                                        style={{width: "150px"}}
                                        options={[
                                            {value: "new", label: "Newest"},
                                            {value: "best", label: "Best seller"},
                                            {value: "low", label: "Low to High price"},
                                            {value: "high", label: "High to Low price"},
                                        ]}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-2">
                            {dataProduct.map(item => (
                                <ProductShow key={item.key} data={item} onClick={onRowClick}/>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Pagination 
                        onChange={onPaginationChange}
                        current={page}
                        total={totalItem}
                        pageSize={24}
                        showSizeChanger={false}
                        />
                    </div>
                </div>
                </Col>

            </Row>
        </div>
    )
}

export default Shop;