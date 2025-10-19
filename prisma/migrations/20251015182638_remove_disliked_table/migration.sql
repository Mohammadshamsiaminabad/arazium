/*
  Warnings:

  - You are about to drop the `DisLikedPost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `like` to the `LikedPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DisLikedPost" DROP CONSTRAINT "DisLikedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DisLikedPost" DROP CONSTRAINT "DisLikedPost_userId_fkey";

-- AlterTable
ALTER TABLE "LikedPost" ADD COLUMN     "like" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "public"."DisLikedPost";
