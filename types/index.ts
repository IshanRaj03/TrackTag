export type PriceHistoryItem = {
  date: Date;
  price: number;
};

export type User = {
  email: string;
};

export type Product = {
  id: number;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  lowestPrice?: number | null;
  highestPrice?: number | null;
  averagePrice?: number | null;
  discountRate?: number | null;
  description: string;
  rating: string;
  category: string;
  reviewsCount: string;
  isOutOfStock: boolean;
  priceHistory?: PriceHistoryItem[];
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
