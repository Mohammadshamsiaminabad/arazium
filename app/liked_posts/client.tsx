"use client";
import GetPosts from "../components/GetPosts";
import { GET_LIKED_POST } from "../graphql/queries";
export default function LikedPostsClient() {


  return (
    <GetPosts query={GET_LIKED_POST} outputType={"get_liked_posts"} />
  );
}