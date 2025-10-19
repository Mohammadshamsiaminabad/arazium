/*
  Warnings:

  - You are about to drop the column `like` on the `LikedPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LikedPost" DROP COLUMN "like";

-- CreateTable
CREATE TABLE "DisLikedPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "DisLikedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisLikedPost_userId_postId_key" ON "DisLikedPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_userId_postId_key" ON "LikedPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_userId_postId_key" ON "SavedPost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "DisLikedPost" ADD CONSTRAINT "DisLikedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLikedPost" ADD CONSTRAINT "DisLikedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
