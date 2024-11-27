import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className="sm:w-[292px] sm:max-w-[292px] w-full flex-1 flex flex-col gap-4 rounded-md"
    >
      <div className="border-2 border-color1 rounded-xl flex-1 relative flex flex-col gap-5  rounded-md">
        <Image
          src={product.image}
          alt={product.title}
          width={580}
          height={400}
          className="h-[250px] object-fill rounded-xl  h-full bg-transparent"
        ></Image>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-color1 text-xl leading-6 font-semibold truncate">
          {product.title}
        </h3>
        <div className="flex justify-between">
          <p className="text-color1">{product.category || "Category"}</p>
          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
