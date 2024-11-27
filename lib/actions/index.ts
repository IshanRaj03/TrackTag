"use server";

import { scrapeAmazonProduct } from "../scraper";
import prisma, { connectDB } from "@/lib/db";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { Product } from "@/types";
import { generateEmailBody, sendEmail } from "../nodeMailer";
import { send } from "process";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) {
    return;
  }

  try {
    connectDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    const existingProduct = await prisma.product.findUnique({
      where: { url: scrapedProduct.url },
      include: {
        priceHistory: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    if (existingProduct) {
      if (
        existingProduct.priceHistory[0].price === scrapedProduct.currentPrice
      ) {
        return;
      }

      const newPriceEntry = {
        price: scrapedProduct.currentPrice,
        date: new Date(),
      };
      const updatedPriceHistory = [
        ...existingProduct.priceHistory.map((history) => ({
          price: history.price,
          date: history.date,
        })),
        newPriceEntry,
      ];

      const productData = {
        ...scrapedProduct,
        currentPrice: scrapedProduct.currentPrice,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };

      await prisma.product.update({
        where: { url: scrapedProduct.url },
        data: {
          url: scrapedProduct.url,
          currency: scrapedProduct.currency,
          image: scrapedProduct.image,
          title: scrapedProduct.title,
          currentPrice: scrapedProduct.currentPrice,
          originalPrice: scrapedProduct.originalPrice,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
          discountRate: scrapedProduct.discountRate,
          description: scrapedProduct.productDetails,
          rating: scrapedProduct.rating || "0",
          reviewsCount: scrapedProduct.reviewCount || "0",
          category: scrapedProduct.category,
          isOutOfStock: scrapedProduct.outOfStock || false, // Corrected field name
          priceHistory: {
            create: newPriceEntry,
          },
        },
      });
    } else {
      console.log(scrapedProduct.rating);
      await prisma.product.create({
        data: {
          url: scrapedProduct.url,
          currency: scrapedProduct.currency,
          image: scrapedProduct.image,
          title: scrapedProduct.title,
          currentPrice: scrapedProduct.currentPrice,
          originalPrice: scrapedProduct.originalPrice,
          lowestPrice: scrapedProduct.currentPrice,
          highestPrice: scrapedProduct.currentPrice,
          averagePrice: scrapedProduct.currentPrice,
          discountRate: scrapedProduct.discountRate,
          description: scrapedProduct.productDetails,
          rating: scrapedProduct.rating || "0",
          reviewsCount: scrapedProduct.reviewCount || "0",
          category: scrapedProduct.category,
          isOutOfStock: scrapedProduct.outOfStock || false,
          priceHistory: {
            create: [{ price: scrapedProduct.currentPrice, date: new Date() }],
          },
        },
      });
    }
    const newProduct = await prisma.product.findUnique({
      where: { url: scrapedProduct.url },
    });

    if (newProduct) {
      revalidatePath(`/products/${newProduct.id}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
export async function getProductByID(productID: string) {
  try {
    connectDB();
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productID) },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error: any) {
    throw new Error(`Failed to get product: ${error.message}`);
  }
}
export async function getAllProducts() {
  try {
    connectDB();
    const products = await prisma.product.findMany();
    return products;
  } catch (error: any) {
    throw new Error(`Failed to get products: ${error.message}`);
  }
}
export async function getSimilarProducts(productId: string) {
  try {
    connectDB();
    const curr = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!curr) {
      throw new Error("Product not found");
    }

    const similarProducts = await prisma.product.findMany({
      where: {
        id: {
          not: parseInt(productId),
        },
      },
      take: 3,
    });

    return similarProducts;
  } catch (error: any) {
    throw new Error(`Failed to get products: ${error.message}`);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: { users: true },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const userExists = await prisma.user.findUnique({
      where: {
        email_productId: {
          email: userEmail,
          productId: parseInt(productId),
        },
      },
    });

    if (!userExists) {
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          users: {
            create: { email: userEmail, productId: parseInt(productId) },
          },
        },
      });

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error: any) {
    throw new Error(`Failed to add user email to product: ${error.message}`);
  }
}
