import { getProductByID, getSimilarProducts } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import PriceInfoCard from "@/components/PriceInfoCard";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";

type Props = {
  params: {
    id: string;
  };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductByID(id);
  if (!product) {
    redirect("/");
  }

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className="flex flex-col gap-16 flex-wrap px-6 md:px-20 py-12">
      <div className="flex flex-col xl:flex-row items-center gap-12 md:gap-24 max-w-screen w-full">
        <div className="xl:max-w-[50%] max-w-full rounded-xl border-2 border-color1 ">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="rounded-xl mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col w-full p-4">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3 ">
              <p className="text-[28px] text-color2 font-bold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF0F0] rounded-10">
                <Image
                  src="/svgs/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="tex-base font-semibold text-color3">
                  {product.reviewsCount.split(" ")[0]}
                </p>
              </div>
              <div className="p-2 bg-[#FFF0F0] rounded-10">
                <Image
                  src="/svgs/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-[#FFF0F0] rounded-10">
                <Image
                  src="/svgs/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-10 py-6 border-y border-y-color3">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[34px] text-color1 ">
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-color2 opacity-50 line-through">
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#FBF3EA] rounded-[27px]">
                  <Image
                    src="/svgs/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-semibold text-color1">
                    {product.rating}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white-200 rounded-[27px]">
                  <Image
                    src="/svgs/comment.svg"
                    alt="comment"
                    width={20}
                    height={20}
                  />
                  <p className="text-sm text-color2 font-semibold">
                    {product.reviewsCount}
                  </p>
                </div>
              </div>
              <p className=" flex justify-center text-sm opacity-50 ">
                <span className="font-semibold text-color2">93%</span> of the
                buyers have recommended this!
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/svgs/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/svgs/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice || product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/svgs/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice || product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/svgs/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice || product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Original Price"
                iconSrc="/svgs/arrow-right.svg"
                value={`${product.currency} ${formatNumber(
                  product.originalPrice || product.currentPrice
                )}`}
              />
            </div>
          </div>
          <Modal productId={id}></Modal>
        </div>
      </div>
      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-color1 font-semibold">
            Product Description
          </h3>
          <div className="flex flex-col gap-4">
            {product.description || "No description available"}
          </div>
        </div>

        <button className="py-4 px-4 bg-color1 hover:bg-opacity-70 rounded-[30px] text-white text-lg font-semibold w-fit mx-auto flex items-center justify-center gap-3 min-w-[250px]">
          <Image src="/svgs/bag.svg" alt="check" width={22} height={22} />
          <Link
            href={product.url || "/"}
            target="_blank"
            className="text-base text-white"
          >
            Buy Now
          </Link>
        </button>
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="text-color1 text-[32px] font-semibold">
            Similar Products
          </p>
          <div className="flex flex-wrap gap-10 mt-7  w-full">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
