import React from "react";
// import { Carousel } from 'react-responsive-carousel';
import { Carousel } from "react-bootstrap";

const CarouselItem = () => {
  const CarouselItems = [
    {
      img: "https://www.efficy.com/wp-content/uploads/2019/03/crm-for-e-commerce-900x412.jpg",
      description: "shop from diffetent categoreis in one cart",
    },
    {
      img: "https://media.istockphoto.com/id/1217702156/photo/asian-postman-deliveryman-wearing-mask-carry-small-box-deliver-to-customer-in-front-of-door.jpg?s=612x612&w=0&k=20&c=rqniTEtz1C0EwOipHl6YxwkX9mZe1YTrFiGjYoyIy5U=",
      description: "get your order in 72 Hours",
    },
    {
      img: "https://cdn.techinasia.com/wp-content/uploads/2016/03/packing-box-seller-ecommerce.jpeg",
      description:
        "Sellers can sell with us and increase their customers target segment",
    },
  ];

  return (
    <Carousel>
      {CarouselItems.map((item, idx) => (
        <Carousel.Item key={idx}>
          <img
            src={item.img}
            className=" w-100 h-lg-75hv h-md-50hv"
            alt="carousel"
          />
          <h1 className="font-size-xl-4 font-size-lg-3 font-size-md-2 ">
            {item.description}
          </h1>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselItem;
