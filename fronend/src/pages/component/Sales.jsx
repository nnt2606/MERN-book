import { Link, useNavigate } from "react-router-dom";
import {Card, Divider, Image} from "antd";
import ButtonDesgin from "../../designLayout/ButtonDesign";
import { defaultImg, sale1, sale3 } from "../../assets";
import { useEffect, useState } from "react";
import { wasSell } from "../../service/serviceAPI";
import ProductShow from "./ProductCard";

const Sale = () => {
  const [listCopy, setListCopy] = useState([]);
  const navigate = useNavigate();

  const onRowClick = (record) =>{
    navigate(`/book/${record.key}`, {state: {record}});
}

  const fetchData = async () => {
    const response = await wasSell();
    if(response.status===200){
      setListCopy(response.data);
    }
  }

  useEffect(()=>{
    fetchData();
  }, []);

  const dataProduct = listCopy.map((book, index)=>({
        key: book.bookId._id,
        title: book.bookId.title,
        img: book.imgURL,
        authors: book.bookId.authors.join(', '),
        price: book.price,
        sold: book.sold,
        inStock: book.inStock
    }))

  return (
    <div className="pb-20 pt-[50px] flex flex-col items-center justify-between gap-4 lg:gap-10">

        <div className="text-left h-140 md:h-200 lg:h-260 w-full mx-4 bg-white"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        >
          <div className="mx-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 mt-10">
              Summer Sales
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6">
              Up to{" "}
              <span className="text-4xl md:text-5xl lg:text-5xl font-bold">
                30%
              </span>{" "}
              sales for all books for children
            </p>
            <Link to="/shop" className="mb-8">
              <ButtonDesgin buttonText="Shop now"/>
            </Link>
          </div>
          <div>
            <img src={sale1} className="h-[250px] my-5"/>
          </div>
        </div>

          <Divider><div className="text-lg font-semibold text-black border-orange bg-white rounded border-[2px] px-2">People also bought</div></Divider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
            {dataProduct.map(item => (
                <ProductShow key={item.key} data={item} onClick={onRowClick}/>
            ))}
            </div>
          <Divider/>


        <div className="text-left h-140 md:h-200 lg:h-260 w-full mx-4 bg-white"
         style={{
          display: "flex",
          justifyContent: "center",
        }}
        >
          <div>
            <img src={sale3} className="h-[250px] my-5"/>
          </div>
          <div className="mx-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 mt-10">
              Flash Sales
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6">
              Up to{" "}
              <span className="text-4xl md:text-5xl lg:text-5xl font-bold">
                10%
              </span>{" "}
              sales for all books
            </p>
            <div className="mb-8">
            <Link to="/shop" className="mb-8">
              <ButtonDesgin buttonText="Shop now"/>
            </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;
