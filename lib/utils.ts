import { PriceHistoryItem, Product } from "@/types/index";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

interface ScrapedProduct {
  url?: string;
  currency?: string;
  image?: string;
  title?: string;
  currentPrice?: number;
  originalPrice?: number;
  priceHistory?: PriceHistoryItem[];
  discountRate?: number;
  outOfStock?: boolean;
  rating?: string;
  reviewCount?: string;
  category?: string;
  productDetails?: string;
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
}

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: { text: () => string }[]): string {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, "");

      let firstPrice: string | undefined;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return "";
}

export function extractCurrency(element: { text: () => string }): string {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText || "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: ScrapedProduct,
  currentProduct: Product
) => {
  const lowestPrice = currentProduct.priceHistory
    ? getLowestPrice(currentProduct.priceHistory)
    : 0;

  if ((scrapedProduct.currentPrice ?? Infinity) < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.outOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if ((scrapedProduct.discountRate ?? 0) >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
