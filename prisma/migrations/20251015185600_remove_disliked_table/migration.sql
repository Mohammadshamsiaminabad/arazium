/*
  Warnings:

  - You are about to drop the `DisLikedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DisLikedPost" DROP CONSTRAINT "DisLikedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DisLikedPost" DROP CONSTRAINT "DisLikedPost_userId_fkey";

-- DropTable
DROP TABLE "public"."DisLikedPost";
