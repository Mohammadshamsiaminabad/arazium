-- DropIndex
DROP INDEX "public"."PostImages_postId_key";

-- AlterTable
ALTER TABLE "PostImages" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PostImages_pkey" PRIMARY KEY ("id");
