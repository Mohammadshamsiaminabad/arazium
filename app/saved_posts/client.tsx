"use client";
import { GET_SAVED_POSTS } from "../graphql/queries";
import GetPosts from "../components/GetPosts";

export default function SavedPostsClient() {
  return (
    <GetPosts query={GET_SAVED_POSTS} outputType={"get_saved_posts"}  />
  )
}