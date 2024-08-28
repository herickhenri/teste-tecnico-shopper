/*
  Warnings:

  - You are about to drop the column `customer_id` on the `measures` table. All the data in the column will be lost.
  - Added the required column `customer_code` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "measures" DROP CONSTRAINT "measures_customer_id_fkey";

-- AlterTable
ALTER TABLE "measures" DROP COLUMN "customer_id",
ADD COLUMN     "customer_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
