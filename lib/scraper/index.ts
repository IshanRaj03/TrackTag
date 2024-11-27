import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // const proxy: Proxy[] = await findProxy();

  try {
    // const selectedProxy = proxy[Math.floor(Math.random() * proxy.length)];
    // console.log("Selected Proxy:", selectedProxy);
    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $(".basisPrice>span>span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStockCheck = $("#availability").text().trim().toLowerCase();
    let outOfStock = false;
    if (
      outOfStockCheck === "currently unavailable" ||
      outOfStockCheck === "out of stock"
    ) {
      outOfStock = true;
    } else {
      outOfStock = false;
    }

    const img =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imgUrl = Object.keys(JSON.parse(img));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const rating = $("#acrPopover").attr("title");

    let productDetail = $("#feature-bullets ul li");
    let productDetails = $(productDetail)
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((detail) => detail)
      .join("\n");

    if (productDetails === "") {
      productDetail = $(
        ".a-expander-content.a-expander-partial-collapse-content"
      );
      productDetails = $(productDetail)
        .first()
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((detail) => detail)
        .join("\n");
    }

    const reviewCount = $("div.averageStarRatingNumerical > span")
      .text()
      .trim();

    const category = $(".a-unordered-list.a-horizontal.a-size-small > li")
      .map((i, el) => $(el).text().trim())
      .get()
      .join(" ")
      .replace(/,/g, " ");

    const data = {
      url,
      currency,
      image: imgUrl[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      outOfStock,
      rating,
      reviewCount,
      category,
      productDetails,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };
    // console.log(data);

    return data;
  } catch (error) {
    throw new Error(`Faield to scrape Amazon product: ${error}`);
  }
}
