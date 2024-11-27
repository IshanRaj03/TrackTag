/*
  Warnings:

  - Made the column `description` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewsCount` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "reviewsCount" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;
