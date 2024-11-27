import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  iconSrc: string;
  value: string;
}

const PriceInfoCard = ({ title, iconSrc, value }: Props) => {
  return (
    <div className="flex-1 min-w-[200px] flex flex-col gap-2 border-l-[3px] rounded-10 bg-white-100 px-5 py-4 border-color2 bg-[#FBF3EA]">
      <p className="text-base text-black-100">{title}</p>
      <div className="flex gap-1">
        <Image src={iconSrc} alt={title} width={24} height={24} />
        <p className="text-2xl font-bold text-color1">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
