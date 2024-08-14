import { Button } from "antd"

const ButtonDesgin = ({buttonText, onClick}) =>{
    return(
        <button className="bg-white text-black border-[3px] border-orange rounded-lg text-lg font-bodyFont w-[185px] h-[50px] hover:border-black hover:text-orange  duration-300 font-bold"
        onClick={onClick}
        >
            {buttonText}
          </button>
    )
}

export default ButtonDesgin