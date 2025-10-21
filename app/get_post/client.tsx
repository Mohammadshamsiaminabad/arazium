"use client";
import { useMutation } from "@apollo/client/react";
import Image from "next/image";
import { PostType } from "../types/post.type";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaRegBookmark,
  FaThumbsDown,
  FaThumbsUp,
  FaBookmark
} from "react-icons/fa";
import { 
  DISLIKE_POST,
  LIKE_POST,
  SAVE_POST,
  UNDISLIKE_POST,
  UNLIKE_POST,
  UNSAVE_POST
} from "../graphql/mutations";
import { useEffect, useState } from "react";

export default function PostsClient(args: { post: PostType | null }) {
  const { post } = args;
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
  const [save, setSave] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [LikePost] = useMutation<{ like_post: boolean }>(LIKE_POST);
  const [UnLikePost] = useMutation<{ unlike_post: boolean }>(UNLIKE_POST);
  const [DislikePost] = useMutation<{ dislike_post: boolean }>(DISLIKE_POST);
  const [UnDislikePost] = useMutation<{ undislike_post: boolean }>(UNDISLIKE_POST);
  const [SavePost] = useMutation<{ save_post: boolean }>(SAVE_POST);
  const [UnSavePost] = useMutation<{ unsave_post: boolean }>(UNSAVE_POST);


  useEffect(() => {
    if (!post) return;
    setLike(post.likedBy);
    setDislike(post.dislikedBy);
    setSave(post.savedBy);
    const timeout = setTimeout(() => setStart(true), 1000);
    return () => clearTimeout(timeout);
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const HandleLike = async () => {
      if (!start) return;
      if (like) {
        try {
          const res = await LikePost({ variables: { id: post.id } });
          if (res.error) throw new Error(res.error.message);
          console.log(res.data?.like_post);
        } catch(err) {
          alert(err);
        }
      } else if (!dislike) {
        try {
          const res = await UnLikePost({ variables: { id: post.id }});
          if (res.error) throw new Error(res.error.message);
          console.log(res.data?.unlike_post);
        } catch(err) {
          alert(err);
        }
      }
    }

    HandleLike();
  }, [like, start, post, LikePost, UnLikePost, dislike]);

  useEffect(() => {
    if (!post) return;
    const HandleDisLike = async () => {
      if (!start) return;
      if (dislike) {
        try {
          const res = await DislikePost({ variables: { id: post.id } });
          if (res.error) throw new Error(res.error.message);
          console.log(res.data?.dislike_post);
        } catch(err) {
          alert(err);
        }
      } else if (!like) {
        try {
          const res = await UnDislikePost({ variables: { id: post.id } });
          if (res.error) throw new Error(res.error.message);
          console.log("this: ", res.data?.undislike_post);
        } catch(err) {
          alert(err);
        }
      }
    };
    HandleDisLike();
  }, [dislike, start, post, DislikePost, UnDislikePost, like]);


  useEffect(() => {
    if (!post) return;
    const HandleSave = async () => {
      if (!start) return;
      if (save) {
        try {
          const res = await SavePost({ variables: { id: post.id } });
          if (res.error) throw new Error(res.error.message);
          console.log(res.data?.save_post);
        } catch(err) {
          alert(err);
        }
      } else {
        try {
          const res = await UnSavePost({ variables: { id: post.id } });
          if (res.error) throw new Error(res.error.message);
          console.log(res.data?.unsave_post);
        } catch(err) {
          alert(err);
        }
      }
    };
    HandleSave();
  }, [save, start, post, SavePost, UnSavePost]);

  if (!post) {
    return <p>post not found</p>
  }
  return (
    <div key={post.id}>
      <p>postId: {post.id}</p>
      <p>title: {post.title}</p>
      <p>description: {post.description}</p>
      <p>price: {post.price}</p>
      <p>color: {post.color}</p>
      <p>category: {post.category}</p>
      <p>mark: {post.mark}</p>
      <Image width={256} height={256} alt={post.title} src={post.main_image} priority />
      {(post.images as { path: string }[]).map((img: { path: string; }, index) => {
        if (index) return <Image key={index} width={256} height={256} alt={post.title} src={img.path} />
      })}
      <button onClick={() => { setLike(prev => !prev); setDislike(false) }} className="icon-btn">
        {like ? <FaThumbsUp className="icon" /> : <FaRegThumbsUp className="icon" />}
      </button>
      <button onClick={() => { setDislike(prev => !prev); setLike(false) }} className="icon-btn">
        {dislike ? <FaThumbsDown className="icon" /> : <FaRegThumbsDown className="icon" />}
      </button>
      <button onClick={() => setSave(prev => !prev)} className="icon-btn">
        {save ? <FaBookmark className="icon" /> : <FaRegBookmark className="icon" />}
      </button>
    </div>
  )
};