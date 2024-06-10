import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {Rate, Button, Empty, Input, Row, Col, Image, Descriptions} from 'antd';
import { createNewRating, getRatingByBookId } from "../service/rating";
import { defaultImg } from "../assets";
import { getCopy } from "../service/serviceAPI";
import { addCart } from "../redux/userSlice";

const { TextArea } = Input;

const ProductDetail = () =>{
    const [mediumRate, setMediumRate] = useState(0);
    const [totalReview, setTotalReview] = useState(0);
    const [ratingsdetail, setRatingdetails]= useState([]);
    const [checkComment, setCheckComment]= useState(false);
    
    const [rateBook, setRateBook] = useState(null);
    const [comment, setComment] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [copy, setCopy] = useState({});
    const {userId, name} = useSelector((state)=> state.user);
    const id = useParams();

    useEffect(()=>{
        const fetch = async () => {

            const res = await getCopy({bookId: id});
            if(res.data!== null){
                setCopy({...res.data})
            }
            console.log(copy);
            
            const response =  await getRatingByBookId({bookId: id._id});
            // console.log(response.data);
            if(response.data !== null) {
                setMediumRate(response.data.mediumRate);
                setTotalReview(response.data.totalReview);
                setRatingdetails(response.data.ratings);
            } 
            
            const check = response.data.ratings.some((rating) => rating.userId._id === userId);
            setCheckComment(!check);
        }
        fetch();
    }, []);

    const handleAddToCart = () =>{
        dispatch(addCart({copyId: copy._id, quantity: 1}))
    }

    const handleComment = async () =>{
        try{
            // console.log(comment);
            const response = await createNewRating({bookId: id, rate: rateBook, comment: comment});
            fetch();
        }catch(error){
            console.log(error);
            // navigate('/login', {state: {from: location}, replace: true})
        }
    }

    return(<div className="pl-10 pr-10">
    {copy && copy.bookId ? (
        
        <div className="flex flex-col gap-5 pl-3 pr-3 pb-5">
            <Row gutter={[16, 16]}>
                <Col span={12} className="flex items-center justify-center pt-10" xs={24} md={12} sm={24}>
                    { typeof copy.imgURL !== "undefined" ?(
                        <Image
                        src={"htttp://localhost:5555/uploads/"+copy.imgURL}
                        />
                    ):(
                        <Image
                        src={defaultImg}
                        />
                    )}
                </Col>
                <Col span={12} xs={24} md={12} sm={24}>
                    <div>
                        <h2 className="text-4xl font-semibold pt-5">{copy.bookId.title}</h2>
                        <p className="text-xl text-gray-600 pl-1 pt-3">{copy.bookId.authors.join(', ')}</p>
                        <p className="text-l text-gray-600 pl-1 pt-3">{"Total sale: " + copy.sold}</p>
                    </div>
                    <div className="text-2xl font-semibold pt-3 pb-3">
                        {/* {console.log(copy)} */}
                        <span>
                        {typeof copy.discount === 'undefined' ? (
                            <span>{copy.price}</span>
                        ):(
                            copy.discount.status ? (
                                <span>
                                    {copy.price*(100-copy.discount.discountNumber)/100}
                                    <span className="text-xl font-semibold line-through ml-2">{copy.price}</span>
                                    <span className="text-xs ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
                                        -{copy.discount.discountNumber}%
                                    </span>
                                </span>
                            ):(
                                <span>{copy.price}</span>
                            )
                        )}
                        </span>
                    </div>
                    <hr/>

                    <p className="text-base text-gray-600 pt-2">
                        <span>
                        Phasellus egestas nulla vel odio condimentum venenatis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ac orci laoreet, molestie sem nec, malesuada odio. Praesent dignissim vel nulla vel mollis. Nam vestibulum mi ligula, eget ornare elit aliquam in. Sed et orci leo. Suspendisse eu lectus sodales, ultrices quam a, feugiat libero.
                        </span>
                        <p className="text-sm mr-2 text-black font-semibold pt-5">Genres: {copy.bookId.genre.join(', ')}</p>
                    </p>

                    <span className="flex items-center">
                        <p className="text-sm font-semibold mr-2"> Total Rating: {mediumRate===null?"0":mediumRate}/5</p>
                        <p className="text-gray-600">({totalReview})</p>
                    </span>

                    {copy.inStock===0 ?(
                        <p className="text-base font-medium" style={{color:"red"}}> Out of Stock</p>
                    ):(
                        <p className="text-base font-medium" style={{color:"green"}}> Available</p>
                    )}
                    <Button
                    disabled={copy.inStock===0?true:false}
                    onClick = {handleAddToCart}
                    className=" bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300 mt-auto"
                    >
                        Add to cart
                    </Button>
                </Col>
            </Row>

            <hr/>
            <div>
                <Descriptions title="Information">
                    <Descriptions.Item label="ISBN">{typeof copy.ISBN!=="undefined" ? copy.ISBN: "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Pages">{typeof copy.pages!=="undefined" ? copy.pages: "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Format">{typeof copy.format!=="undefined" ? copy.format: "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Language">{typeof copy.language!=="undefined" ? copy.language: "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Publish Year">{typeof copy.publishYear!=="undefined" ? copy.publishYear: "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Publisher">{typeof copy.publisher!=="undefined" ? copy.publisher: "No data"}</Descriptions.Item>          
                </Descriptions>
            </div>

            {  userId &&( checkComment ? (
            <div className="pl-5 pr-5">
                <p className="font-medium pb-2 pt-2 pl-4">Review this book</p>
                <div className=" border rounded-md pl-5 bg-white border-gray-700">
                    <p className="text-black text-l font-semibold pt-3">{name}</p>
                    <span className="flex items-center pt-2">
                        <p className="pr-4">Rating: </p>
                        <Rate onChange={setRateBook} value={rateBook}/>
                    </span>
                    <div className="pt-4 pb-4 pr-4 h-100">
                    <TextArea
                        showCount
                        maxLength={100}
                        placeholder="Leave a comment"
                        onChange={(e)=>setComment(e.target.value)}
                        style={{height: 120}}
                    />
                    </div>
                    <div className="pb-5 flex justify-between items-center">
                        <Button 
                        disabled={rateBook===null?true:false}
                        className="bg-black text-gray-200 hover:text-white cursor-pointer text-base font-medium h-10 rounded-md  duration-300"
                        onClick={handleComment}
                        >
                            Comment
                        </Button>
                    </div>
                </div>
            </div>
            ):(
                <div className="text-gray-400 font-sm">Login to comment</div>
            ))}

            <hr/>
            <div>
                { ratingsdetail.length > 0 ? (
                    <div>
                        {ratingsdetail.map((rating) =>(
                            <div key={rating._id} className=" border rounded-md pl-5 bg-white border-gray-200 pb-3 mb-3">
                                <p className="text-black text-m font-semibold pt-3"
                                style={{color: rating.userId._id === userId? 'green': 'black'}}
                                >
                                    {rating.userId.name}  {rating.userId._id === userId? "(You)": ""}
                                </p>
                                <Rate disabled defaultValue={rating.rate} />
                                <p className="text-sm">{rating.comment}</p>
                            </div>
                        ))
                        }
                    </div>
                ):(
                    <Empty description="No comment"/>
                )
            }
            </div>

        </div>
    ):(
        <Empty />
    )
}
    </div>
)}

export default ProductDetail;