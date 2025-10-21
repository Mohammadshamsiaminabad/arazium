import { GET_POST } from "../graphql/queries";
import { PostType } from "../types/post.type";
import { serverClient } from "../lib/apollo-server-client";
import PostsClient from "./client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
async function getPostData(id: string): Promise<PostType | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";
  const refreshToken = cookieStore.get("refresh_token")?.value || "";

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : "",
    refreshToken ? `refresh_token=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  const { data } = await serverClient.query<{ get_post: PostType }>({
    query: GET_POST,
    variables: { id: parseInt(id) },
    fetchPolicy: "no-cache",
    context: {
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader
      }
    }
  });
  return data?.get_post ?? null;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const post = await getPostData(id || "0");

  if (!post) {
    return {
      title: "پست یافت نشد",
      description: "این پست وجود ندارد",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.main_image ? [post.main_image] : [],
    },
  };
}

export default async function Posts({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const post = await getPostData(id || "");
  return <PostsClient post={post} />;
}
