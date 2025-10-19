"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PostType } from "../types/post.type";
import Link from "next/link";
import { useLazyQuery } from "@apollo/client/react";

export default function GetPosts({ query, outputType }: any) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [loadPosts, { error, data, loading }] = useLazyQuery<any>(query);

  useEffect(() => {
    loadPosts({ variables: { lastPostId } });
  }, []);

  useEffect(() => {
    console.log(lastPostId);
  }, [lastPostId])

  useEffect(() => {
    if (!data?.[outputType]) return;
    if (outputType === "get_posts") {
      const new_posts = data?.[outputType] as PostType[];
      if (new_posts.length) {
        setPosts(prev => [...prev, ...new_posts]);
        setLastPostId(data[outputType][new_posts.length - 1].id);
        if (new_posts.length < 20) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } else {
      const new_posts = data?.[outputType]?.posts as PostType[];
      if (new_posts.length) {
        setPosts(prev => [...prev, ...new_posts]);
        setLastPostId(data[outputType]?.lastPostId);
        if (new_posts.length < 20) setHasMore(false);
      } else {
        setHasMore(false);
      }
    }

  }, [data]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadPosts({ variables: { lastPostId } })
        }
      }
    )
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, lastPostId, observerRef, loading, loadPosts]);
  if (error) {
    return <p>خطا: {error.message}</p>;
  }

  return (
    <div>
      <h2>getPosts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <p>postId: {post.id}</p>
          <p>title: {post.title}</p>
          <p>description: {post.description}</p>
          <p>price: {post.price}</p>
          <p>color: {post.color}</p>
          <p>category: {post.category}</p>
          <p>mark: {post.mark}</p>
          <Image width={256} height={256} alt="salam" src={post.main_image} />
          <br />
          <Link className="link" href={`/get_post/?id=${post.id}`}>دیدن</Link>
        </div>
      ))}
      {loading && <p>loading ...</p>}
      {hasMore && !loading && <div ref={observerRef}></div>}

      {!hasMore && posts.length !== 0 && <p>تمام پست ها بارگذاری شد</p>}
    </div>
  )
}
