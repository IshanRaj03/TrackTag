import prisma, { connectDB } from "@/lib/db";
import { generateEmailBody, sendEmail } from "@/lib/nodeMailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

interface UpdatedProductResult {
  id: number;
  updated: boolean;
}

export async function GET() {
  try {
    connectDB();

    const products = await prisma.product.findMany();
    if (!products || products.length === 0) {
      throw new Error("No products found");
    }

    const updatedProducts: UpdatedProductResult[] = (
      await Promise.all(
        products.map(async (currentProduct) => {
          const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
          if (!scrapedProduct) {
            console.log(`No data found for product: ${currentProduct.url}`);
            return null; // Skip products with no scraped data
          }

          const existingProduct = await prisma.product.findUnique({
            where: { url: scrapedProduct.url },
            include: {
              priceHistory: {
                orderBy: { date: "desc" },
                take: 1, // Fetch only the latest price entry
              },
              users: true, // Include users for email notifications
            },
          });

          if (existingProduct) {
            const latestPrice =
              existingProduct.priceHistory.length > 0
                ? existingProduct.priceHistory[0].price
                : null;

            // Skip if the price hasn't changed
            if (latestPrice === scrapedProduct.currentPrice) {
              console.log(`No price change for product: ${existingProduct.id}`);
              return { id: existingProduct.id, updated: false };
            }

            // Prepare updates
            const updates: Record<string, any> = {};
            const newPriceEntry = {
              price: scrapedProduct.currentPrice,
              date: new Date(),
            };

            if (scrapedProduct.currentPrice !== currentProduct.currentPrice) {
              const updatedPriceHistory = [
                ...existingProduct.priceHistory.map((history) => ({
                  price: history.price,
                  date: history.date,
                })),
                newPriceEntry,
              ];

              updates.currentPrice = scrapedProduct.currentPrice;
              updates.lowestPrice = getLowestPrice(updatedPriceHistory);
              updates.highestPrice = getHighestPrice(updatedPriceHistory);
              updates.averagePrice = getAveragePrice(updatedPriceHistory);
              updates.priceHistory = {
                create: newPriceEntry, // Add new price entry
              };
            }

            // Update other attributes if they differ
            if (scrapedProduct.title !== existingProduct.title) {
              updates.title = scrapedProduct.title;
            }
            if (scrapedProduct.currency !== existingProduct.currency) {
              updates.currency = scrapedProduct.currency;
            }
            if (scrapedProduct.image !== existingProduct.image) {
              updates.image = scrapedProduct.image;
            }
            if (
              scrapedProduct.originalPrice !== existingProduct.originalPrice
            ) {
              updates.originalPrice = scrapedProduct.originalPrice;
            }
            if (scrapedProduct.discountRate !== existingProduct.discountRate) {
              updates.discountRate = scrapedProduct.discountRate;
            }
            if (scrapedProduct.productDetails !== existingProduct.description) {
              updates.description = scrapedProduct.productDetails;
            }
            if (scrapedProduct.rating !== existingProduct.rating) {
              updates.rating = scrapedProduct.rating || "0";
            }
            if (scrapedProduct.reviewCount !== existingProduct.reviewsCount) {
              updates.reviewsCount = scrapedProduct.reviewCount || "0";
            }
            if (scrapedProduct.category !== existingProduct.category) {
              updates.category = scrapedProduct.category;
            }
            if (scrapedProduct.outOfStock !== existingProduct.isOutOfStock) {
              updates.isOutOfStock = scrapedProduct.outOfStock || false;
            }

            if (Object.keys(updates).length > 0) {
              await prisma.product.update({
                where: { id: existingProduct.id },
                data: updates,
              });

              console.log(`Updated product: ${existingProduct.id}`);
            } else {
              console.log(
                `No updates required for product: ${existingProduct.id}`
              );
            }

            // Send email notifications if necessary
            const emailNotifType = getEmailNotifType(
              scrapedProduct,
              currentProduct
            );

            if (emailNotifType && existingProduct.users.length > 0) {
              const emailContent = await generateEmailBody(
                {
                  title: existingProduct.title,
                  url: existingProduct.url,
                },
                emailNotifType
              );
              const userEmails = existingProduct.users.map(
                (user) => user.email
              );
              await sendEmail(emailContent, userEmails);
            }

            return { id: existingProduct.id, updated: true };
          } else {
            console.log(`Product not found for URL: ${scrapedProduct.url}`);
            return null;
          }
        })
      )
    ).filter((product): product is UpdatedProductResult => product !== null); // Filter out null values

    return NextResponse.json({
      message: "Products updated",
      data: updatedProducts,
    });
  } catch (error: any) {
    console.error(`Error in cron job: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
