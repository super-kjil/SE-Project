import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import image1 from "../../assets/image/product/Dell Vostro.jpg";
import image2 from "../../assets/image/product/MacBook-Air-M1.jpg";
import image3 from "../../assets/image/product/Lenovo ThinkPad E14 G5.jpg";
const Carousel = () => {
  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Slide every 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Function to handle dot click
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // AOS initialization
  useEffect(() => {
    AOS.init({
      duration: 3000, // Animation duration
      once: false, // Allow animations to happen more than once
      offset: 200, // Offset (in px) from the original trigger point
      easing: "ease-in-out", // Easing function
      mirror: true, // Allow elements to animate out while scrolling past them
    });
  }, []);

  return (
    <>
      <div className="bg-white overflow-hidden flex justify-center items-center">
        {/* <div className="max-w-5xl h-auto"> */}
        <div className="relative max-w-5xl h-auto px-10 lg:px-0">
          {/* Carousel Image */}
          <div className="">
            <img
              src={images[currentIndex]}
              alt="Carousel Image"
              className="w-full h-full"
            />
            <div className=""></div>
          </div>

          {/* Dots for Navigation - Positioned at the Bottom of the Image */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex
                    ? "bg-red-500"
                    : "bg-gray-300 hover:bg-red-500"
                } transition-colors duration-300`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Carousel;
