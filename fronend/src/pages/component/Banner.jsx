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
import {Image} from "antd";
import ButtonDesgin from "../../designLayout/ButtonDesign";

const slides = [
    {
      imgSrc: banner,
      text: "Hiroshige. One Hundred Famous Views of Edo",
      Subtext:
        "One of the masterpieces of the ukiyo-e woodblock printing tradition and a paradigm of the Japonisme that inspired Impressionist, Post-Impressionist and Art Nouveau artists, from Vincent van Gogh to James McNeill Whistler",
      buttonLink: "/shop",
      buttonText: "Shop Now",
    },
    {
      imgSrc: coverbook2,
      text: "Redouté. Roses",
      Subtext:
        "Flower painter and botanist Pierre-Joseph Redouté was an unparalleled master of botanical illustrations and engravings. His most celebrated work Les Roses was published in three volumes between 1817 and 1824. This edition displays his remarkable talent for capturing nature's elusive beauty with vibrancy and accuracy",
      buttonLink: "/shop",
      buttonText: "Shop Now",
    },
    {
        imgSrc: coverbook1,
        text: "Ellen von Unwerth. Heimat",
        Subtext:
          "A place of alpine forests. Emerald lakes. And beautiful, snow-dusted peaks. A land where cowbells tinkle in meadows. Where days pass at a more natural pace. And where village girls Hilda, Traudel, Heidi and their friends enjoy a quiet life of country pursuits. Join their idyllic adventure. Set foot on a journey of joy.",
        buttonLink: "/shop",
        buttonText: "Shop Now",
      },
      {
        imgSrc: coverbook3,
        text: "Industrial Design A–Z",
        Subtext:
          "From cameras to kitchenware, Lego to Lamborghini, follow the makers and shapers of industrial design in Industrial Design A–Z. This revised and updated edition covers the individual designers, the global businesses, and above all the genius products that have synthesized form and function to transform our daily lives.",
        buttonLink: "/shop",
        buttonText: "Shop Now",
      },
  ];

  const CustomSlide = ({ Subtext, imgSrc, text, buttonLink, buttonText }) => (
    <div
      style={{
        position: "relative",
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Center vertically
        maxHeight: "500px",
      }}
      className="fixed px-5"
    >
      <div>
        <h1
          style={{
            maxWidth: "475px", // Adjust the maxWidth as needed
            maxHeight: "175px",
            fontSize: "2.5rem", // Adjust the font size as needed
            color: "black", // Black color
            fontWeight: "600",
            WebkitTextStroke: '1px black',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)', // Text shadow
          }}
        >
          {text}
        </h1>
        <p
          style={{
            maxWidth: "475px", // Adjust the maxWidth as needed
            maxHeight: "81px",
            marginTop: "10px",
            marginBottom: "60px",
            fontSize: "1.0rem", // Adjust the font size as needed
            color: "black",
          }}
          className="line-clamp-7"
        >
          {Subtext}
        </p>
  
        <Link to={buttonLink}>
          <ButtonDesgin buttonText={buttonText}/>
        </Link>
      </div>
      <div style={{ 
        marginLeft: "100px",
        }}
        className="w-full h-auto max-w-xs"
        >
        <img src={imgSrc} />
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