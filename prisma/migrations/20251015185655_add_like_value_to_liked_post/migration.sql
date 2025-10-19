/*
  Warnings:

  - Added the required column `like` to the `SavedPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedPost" ADD COLUMN     "like" BOOLEAN NOT NULL;
