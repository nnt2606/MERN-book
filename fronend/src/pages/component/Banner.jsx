import { Link } from "react-router-dom";
import React from "react";
import { useState } from "react";
import Slider from "react-slick";
import {
    banner,
    coverbook1,
    coverbook2,
    coverbook3
} from "../../assets";
import Image from "../../designLayout/Image";

const slides = [
    {
      imgSrc: banner,
      text: "Lorem ipsum dolor sit amet",
      Subtext:
        "Sed do eiusmod tempor incididunt ut labortation ullamco labori",
      buttonLink: "/shop",
      buttonText: "Shop Now",
    },
    {
      imgSrc: coverbook1,
      text: "Lorem ipsum dolor sit amet",
      Subtext:
        "Sed do eiusmod tempor incididunt ut labortation ullamco labori",
      buttonLink: "/shop",
      buttonText: "Shop Now",
    },
    {
        imgSrc: coverbook2,
        text: "Lorem ipsum dolor sit amet",
        Subtext:
          "Sed do eiusmod tempor incididunt ut labortation ullamco labori",
        buttonLink: "/shop",
        buttonText: "Shop Now",
      },
      {
        imgSrc: coverbook3,
        text: "Lorem ipsum dolor sit amet",
        Subtext:
          "Sed do eiusmod tempor incididunt ut labortation ullamco labori",
        buttonLink: "/shop",
        buttonText: "Shop Now",
      },
  ];

  const CustomSlide = ({ Subtext, imgSrc, text, buttonLink, buttonText }) => (
    <div
      style={{
        position: "relative",
        backgroundColor: "#F5F5F3", // Gray background color
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Center vertically
      }}
    >
      <div
        style={{
          maxWidth: "450px", // Adjust the maxWidth as needed
          marginRight: "100px", // Add margin between text/button and image
        }}
      >
        <h1
          style={{
            marginBottom: "15px",
            fontSize: "2.5rem", // Adjust the font size as needed
            color: "#000", // Black color
            fontWeight: "700",
          }}
        >
          {text}
        </h1>
        <p
          style={{
            marginBottom: "25px",
            fontSize: "1.5rem", // Adjust the font size as needed
            color: "#666", // Gray color
          }}
        >
          {Subtext}
        </p>
  
        <Link to={buttonLink}>
          <button className="bg-black text-white text-lg font-bodyFont w-[185px] h-[50px] hover:bg-black duration-300 font-bold">
            {buttonText}
          </button>
        </Link>
      </div>
      <div style={{ marginLeft: "100px" }}>
        <Image imgSrc={imgSrc} />
      </div>
    </div>
  );
  
  const Banner = () => {
    const [dotActive, setDocActive] = useState(0);
    const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      arrows: false,
    };
  
    return (
      <div className="w-full bg-white">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <CustomSlide key={index} {...slide} />
          ))}
        </Slider>
      </div>
    );
  };
  
  export default Banner;