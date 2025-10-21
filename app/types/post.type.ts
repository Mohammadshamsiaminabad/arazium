

export interface PostType { 
  id: number;
  userId: number;
  title: string;
  description: string;
  price: number;
  color: string;
  category: string;
  mark: string;
  main_image: string;
  images?: { path: string }[] | string[];
  createdAt?: string;
  updatedAt?: string;
  likedBy: boolean;
  dislikedBy: boolean;
  savedBy: boolean;
}