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
  if (!post) return <p>post not found</p>
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [save, setSave] = useState(false);
  const [start, setStart] = useState(false);
  const [LikePost] = useMutation<{ like_post: Boolean }>(LIKE_POST);
  const [UnLikePost] = useMutation<{ unlike_post: Boolean }>(UNLIKE_POST);
  const [DislikePost] = useMutation<{ dislike_post: Boolean }>(DISLIKE_POST);
  const [UnDislikePost] = useMutation<{ undislike_post: Boolean }>(UNDISLIKE_POST);
  const [SavePost] = useMutation<{ save_post: Boolean }>(SAVE_POST);
  const [UnSavePost] = useMutation<{ unsave_post: Boolean }>(UNSAVE_POST);


  useEffect(() => {
    setLike(post.likedBy);
    setDislike(post.dislikedBy);
    setSave(post.savedBy);
    const timeout = setTimeout(() => setStart(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
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
  }, [like]);

  useEffect(() => {
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
  }, [dislike]);


  useEffect(() => {
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
  }, [save]);


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
      { post.images?.map((img: any, index) => {
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