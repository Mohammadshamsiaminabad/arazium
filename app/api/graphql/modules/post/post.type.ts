import { PostCategory, PostColor, PostMark } from "@prisma/client"

export interface PostType {
  title: string;
  description: string;
  price: number;
  color: PostColor;
  category: PostCategory;
  mark: PostMark;
  images: string[];
}