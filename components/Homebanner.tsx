"use client";

import React from "react";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const heroImages = [
  { id: "a", imgUrl: "/images/heroLaptop.jpg", alt: "laptop" },
  { id: "b", imgUrl: "/images/heroSmartphone.jpg", alt: "smartphone" },
  { id: "c", imgUrl: "/images/heroHeadphones.jpg", alt: "headphones" },
  { id: "d", imgUrl: "/images/heroSmartwatch.jpg", alt: "smartwatch" },
  { id: "e", imgUrl: "/images/heroSneakers.jpg", alt: "sneakers" },
];

const Homebanner = () => {
  return (
    <div className="mt-12 relative sm:px-10 py-5 sm:pt-20 pb-5 max-w-[560px] h-[700px] w-full sm:mx-auto ">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={2000}
        showStatus={false}
        showArrows={false}
        className="rounded-xl border-2 border-darkgreen overflow-hidden"
      >
        {heroImages.map((image) => (
          <Image
            key={image.id}
            src={image.imgUrl}
            alt={image.alt}
            width={1920}
            height={1080}
            className="object-contain rounded-xl overflow-hidden"
          />
        ))}
      </Carousel>
      <Image
        src="/hand-drawn-arrow.svg"
        alt="hand"
        width={175}
        height={175}
        className="max-xl:hidden absolute -left-[10%] bottom-16 z-0"
      />
    </div>
  );
};

export default Homebanner;
