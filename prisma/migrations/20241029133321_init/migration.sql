-- CreateTable
CREATE TABLE "ProductSchema" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "priceHistory" DOUBLE PRECISION[],
    "discountRate" DOUBLE PRECISION NOT NULL,
    "outOfStock" BOOLEAN NOT NULL,
    "rating" TEXT NOT NULL,
    "reviewCount" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "productDetails" TEXT NOT NULL,
    "lowestPrice" DOUBLE PRECISION NOT NULL,
    "highestPrice" DOUBLE PRECISION NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSchema_pkey" PRIMARY KEY ("id")
);
