import { Link } from "react-router-dom";
import { sale1, sale3 } from "../../assets";
import Image from "../../designLayout/Image";

const Sale = () => {
  return (
    <div className="py-20 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-10">
      <div className=" w-full md:w-2/3 lg:w-1/2 h-full flex flex-col justify-center items-center text-black">
        <div className="w-full mb-4 center"></div>
        <div className="text-left h-140 md:h-200 lg:h-260 w-full mx-4 bg-[#f3f3f3]">
          <div className="mx-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              Imprimante Sales
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6">
              Up to{" "}
              <span className="text-4xl md:text-5xl lg:text-5xl font-bold">
                30%
              </span>{" "}
              sales for all impriamnte
            </p>
            <div className="mb-8">
              <button className="bg-black text-white text-lg font-bodyFont w-[185px] h-[50px] hover:bg-black duration-300 font-bold">
                Shop Now
              </button>
            </div>
          </div>
        </div>
        <div className="text-left h-140 md:h-200 lg:h-260 w-full mx-4 mt-10 bg-[#f3f3f3]">
          <div className="mx-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              Flash Sales
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6">
              Up to{" "}
              <span className="text-4xl md:text-5xl lg:text-5xl font-bold">
                10%
              </span>{" "}
              sales for all impriamnte
            </p>
            <div className="mb-8">
              <button className="bg-black text-white text-lg font-bodyFont w-[185px] h-[50px] hover:bg-black duration-300 font-bold">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 h-auto flex flex-col gap-4 lg:gap-10">
        <div className="h-1/2 w-full">
          <Link to="/shop">
            <Image className="h-40 md:h-50 lg:h-60 object-cover" imgSrc={sale1} />
          </Link>
        </div>
        <div className="h-1/2 w-full">
          <Link to="/shop">
            <Image className="h-40 md:h-50 lg:h-60 object-cover" imgSrc={sale3} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
