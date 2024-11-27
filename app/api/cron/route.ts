import prisma, { connectDB } from "@/lib/db";
import { generateEmailBody, sendEmail } from "@/lib/nodeMailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { Product } from "@prisma/client";
import { NextResponse } from "next/server";

interface ProductUpdate {
  id: number;
  updated: boolean;
}

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    connectDB();

    const products = await prisma.product.findMany({
      include: {
        priceHistory: { orderBy: { date: "desc" } },
        users: true, // Include the `users` relation
      },
    });

    if (!products || products.length === 0) {
      throw new Error("No products found");
    }

    const updatedProducts: ProductUpdate[] = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) return { id: currentProduct.id, updated: false };

        const updates: Partial<Product> = {};
        const priceChanged =
          scrapedProduct.currentPrice !== currentProduct.currentPrice;

        if (priceChanged) {
          const newPriceEntry = {
            price: scrapedProduct.currentPrice,
            date: new Date(),
          };

          const updatedPriceHistory = [
            ...(currentProduct.priceHistory || []).map((history) => ({
              price: history.price,
              date: history.date,
            })),
            newPriceEntry,
          ];

          updates.currentPrice = scrapedProduct.currentPrice;
          updates.lowestPrice = getLowestPrice(updatedPriceHistory);
          updates.highestPrice = getHighestPrice(updatedPriceHistory);
          updates.averagePrice = getAveragePrice(updatedPriceHistory);

          // Add a new entry to the price history table
          await prisma.priceHistory.create({
            data: {
              price: scrapedProduct.currentPrice,
              date: new Date(),
              productId: currentProduct.id,
            },
          });
        }

        // Check and update other attributes
        if (scrapedProduct.title !== currentProduct.title) {
          updates.title = scrapedProduct.title;
        }
        if (scrapedProduct.currency !== currentProduct.currency) {
          updates.currency = scrapedProduct.currency;
        }
        if (scrapedProduct.image !== currentProduct.image) {
          updates.image = scrapedProduct.image;
        }
        if (scrapedProduct.originalPrice !== currentProduct.originalPrice) {
          updates.originalPrice = scrapedProduct.originalPrice;
        }
        if (scrapedProduct.discountRate !== currentProduct.discountRate) {
          updates.discountRate = scrapedProduct.discountRate;
        }
        if (scrapedProduct.productDetails !== currentProduct.description) {
          updates.description = scrapedProduct.productDetails;
        }
        if (scrapedProduct.rating !== currentProduct.rating) {
          updates.rating = scrapedProduct.rating || "0";
        }
        if (scrapedProduct.reviewCount !== currentProduct.reviewsCount) {
          updates.reviewsCount = scrapedProduct.reviewCount || "0";
        }
        if (scrapedProduct.category !== currentProduct.category) {
          updates.category = scrapedProduct.category;
        }
        if (scrapedProduct.outOfStock !== currentProduct.isOutOfStock) {
          updates.isOutOfStock = scrapedProduct.outOfStock || false;
        }

        if (Object.keys(updates).length > 0) {
          await prisma.product.update({
            where: { id: currentProduct.id },
            data: updates,
          });

          console.log(`Updated product: ${currentProduct.id}`);

          // Notify users if there is a significant update
          const emailNotifType = getEmailNotifType(
            scrapedProduct,
            currentProduct
          );
          if (emailNotifType && currentProduct.users.length > 0) {
            const emailContent = await generateEmailBody(
              { title: currentProduct.title, url: currentProduct.url },
              emailNotifType
            );

            const userEmails = currentProduct.users.map((user) => user.email);
            await sendEmail(emailContent, userEmails);
          }

          return { id: currentProduct.id, updated: true };
        }

        console.log(`No changes for product: ${currentProduct.id}`);
        return { id: currentProduct.id, updated: false };
      })
    );

    return NextResponse.json({
      message: "Products updated successfully",
      data: updatedProducts,
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error in GET /cron: ${error}`);
  }
}
