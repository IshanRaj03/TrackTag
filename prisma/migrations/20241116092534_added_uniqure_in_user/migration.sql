/*
  Warnings:

  - A unique constraint covering the columns `[email,productId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_productId_key" ON "users"("email", "productId");
