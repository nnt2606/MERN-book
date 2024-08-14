import { Flex, Image } from "antd";
import { formatNumber } from "../../const/utils";
import { Link } from "react-router-dom";

const ProductShow = ({data, onClick}) =>{

    return(
        <Link to={`/book/${data.key}`}
        className="relative border-grayColor border-[1px] rounded m-4 flex flex-col max-w-lg max-h-[50rem] transition duration-200 hover:transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
        onClick={()=>onClick(data)}
        >
            <div className="bg-grayColor rounded flex items-center justify-center">
                <img src={data.img} alt={data.img}
                        className="justify-center w-[200px] h-[300px]"
                />
            </div>
            <div className="m-2">
                {data.inStock === 0? (
                    <div className="text-gray-800">
                        <h2 className="font-semibold text-xl line-clamp-2">{data.title}by {data.authors}</h2>
                    {/* <p className="line-clamp-2 pb-5">{data.authors}</p> */}
                    <div className="flex justify-between items-center mt-10 mb-8 pb-5">
                        <Flex className=" text-lg font-semibold absolute bottom-[75px]">
                        {typeof data.discount === 'undefined' ? (
                            <span>
                                {formatNumber(data.price)}
                                <span className="text-sm ml-[4px]">đ</span>
                            </span>
                            
                        ):(
                            data.discount.status=== true ? (
                                <span>
                                    {data.price*(100-data.discount.discountNumber)/100}
                                    <span className="text-xl font-semibold line-through ml-2">{formatNumber(data.price)}</span>
                                    <span className="text-xs ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
                                        -{formatNumber(copy.discount.discountNumber)}%
                                    </span>
                                </span>
                            ):(
                                <span>{formatNumber(data.price)}</span>
                            )
                        )}
                        </Flex>
                        <p className="text-[13px] text-gray-400 absolute bottom-[55px]">Sold: {data.sold}</p>
                    </div>

                    <div className="flex justify-between items-center mt-8 mb-8 absolute bottom-0">
                            <p className="text-base font-semibold"> Out of stock</p>
                    </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="font-semibold text-xl line-clamp-2">{data.title} - {data.authors}</h2>
                    {/* <p className="line-clamp-2 pb-5">{data.authors}</p> */}
                    <div className="flex justify-between items-center mt-10 mb-8 pb-5">
                        <Flex className=" text-orange text-lg font-semibold absolute bottom-[75px]">
                        {typeof data.discount === 'undefined' ? (
                            <span>
                                {formatNumber(data.price)}
                                <span className="text-sm ml-[4px]">đ</span>
                            </span>
                            
                        ):(
                            data.discount.status ? (
                                <span>
                                    {data.price*(100-data.discount.discountNumber)/100}
                                    <span className="text-xl font-semibold line-through ml-2">{formatNumber(data.price)}</span>
                                    <span className="text-xs ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
                                        -{formatNumber(copy.discount.discountNumber)}%
                                    </span>
                                </span>
                            ):(
                                <span>{formatNumber(data.price)}</span>
                            )
                        )}
                        </Flex>
                        <p className="text-[13px] text-gray-400 absolute bottom-[55px]">Sold: {data.sold}</p>
                    </div>

                    <div className="flex justify-between items-center mt-8 mb-8 absolute bottom-0">
                            <p className="text-base font-semibold" style={{color:"green"}}> Available</p>
                    </div>

                    </div>
                )}
                    
                </div>
                
        </Link>
    )
}

export default ProductShow;