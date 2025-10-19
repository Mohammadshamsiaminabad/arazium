/*
  Warnings:

  - You are about to drop the column `like` on the `SavedPost` table. All the data in the column will be lost.
  - Added the required column `like` to the `LikedPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LikedPost" ADD COLUMN     "like" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "SavedPost" DROP COLUMN "like";
