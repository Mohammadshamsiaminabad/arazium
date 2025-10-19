/*
  Warnings:

  - Added the required column `order` to the `PostImages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Post_id_key";

-- AlterTable
ALTER TABLE "PostImages" ADD COLUMN     "order" SMALLINT NOT NULL;
