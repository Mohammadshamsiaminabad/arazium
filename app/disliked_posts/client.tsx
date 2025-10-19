"use client";

import GetPosts from "../components/GetPosts";
import { GET_DISLIKED_POSTS } from "../graphql/queries";

export default function DislikedPostsClient() {
  return (
    <GetPosts query={GET_DISLIKED_POSTS} outputType={"get_disliked_posts"} />
  )
}