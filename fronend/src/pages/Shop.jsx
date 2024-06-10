import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import {Breadcrumb} from 'antd';
import { useDispatch, useSelector } from "react-redux";
import {Table} from "antd";
import { getAllCopy, getBook } from "../service/serviceAPI";

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
        key: 'authors'
    },
    {
        title: 'Genre',
        dataIndex: 'genre',
        key: 'genre'
    }
]

const Shop = () =>{
    const navigate = useNavigate();
    const [books, setBooks] = useState([])

    useEffect(()=>{
        const fetch = async() =>{
            const response = await getAllCopy();
            if(response.data!== null){
                setBooks([...response.data]);
            }
        }
        fetch();
    },[])

    const data = books.map((book, index)=>({
        key: book.bookId._id,
        title: book.bookId.title,
        authors: book.bookId.authors.join(', '),
        genre: book.bookId.genre.join(', '),
    }))

    const onRowClick = (record) =>{
        navigate(`/book/${record.key}`, {state: {record}});
    }

    return(
        <div className="max-w-container mx-auto px-4 pl-10 pr-10">
            <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
            <h1 className="text-5xl text-primeColor font-titleFont font-bold">
                Products
            </h1>
            <Breadcrumb items = {[
                {
                    title: "Home",
                    href: '/home'
                },
                {
                    title: "Shop"
                }
            ]}
            />
            </div>
            <div className="w-full h-full flex pb-20 gap-10 pl-5 pr-5">
                <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
                    <Table
                    className="w-full"
                    columns={columns}
                    dataSource = {data || []}
                    pagination = {{pageSize: 10}}
                    onRow={(book) =>{
                        return{ onClick: ()=>{
                            onRowClick(book);
                        }
                    }
                    }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Shop;