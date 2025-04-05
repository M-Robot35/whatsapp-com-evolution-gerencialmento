/*
  Warnings:

  - You are about to drop the column `base64` on the `instancia` table. All the data in the column will be lost.
  - Added the required column `baseCode` to the `instancia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instancia" DROP COLUMN "base64",
ADD COLUMN     "baseCode" TEXT NOT NULL;
