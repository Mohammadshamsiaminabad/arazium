/*
  Warnings:

  - Added the required column `main_image` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "main_image" TEXT NOT NULL;
