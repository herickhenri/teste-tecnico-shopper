/*
  Warnings:

  - The `confirmed_value` column on the `measures` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "measures" DROP COLUMN "confirmed_value",
ADD COLUMN     "confirmed_value" INTEGER;
