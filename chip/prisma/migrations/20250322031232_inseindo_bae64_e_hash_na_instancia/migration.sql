/*
  Warnings:

  - Added the required column `base64` to the `instancia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `instancia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instancia" ADD COLUMN     "base64" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL;
