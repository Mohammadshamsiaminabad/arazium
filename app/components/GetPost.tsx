"use client";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { GET_POST } from "../graphql/queries";
import { PostType } from "../types/post.type";
import Image from "next/image";

export default function GetPost() {
  const [postId, setPostId] = useState(0);
  const [GetPost, { loading, error, data }] = useLazyQuery<{ get_post: PostType }>(GET_POST, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);


  const handleGetPost = async () => {
    try {
      GetPost({ variables: { id: postId } })
    } catch(err) {
      alert("error");
      console.log(error?.message);
    }
  };

  return (
    <div
      style={{
        padding: "50px 10px"
      }}>
      <h2>test Get Post API</h2>
      <input
        type="number"
        placeholder="enter post id ..."
        value={postId}
        onChange={e => setPostId(parseInt(e.target.value))} />
      <button onClick={handleGetPost}>Get</button>
      { loading && <p>loading ...</p> }
      { error && <p>error: {error.message}</p> }
      { data?.get_post ? 
        <div key={data.get_post.id}>
          <p>postId: {data.get_post.id}</p>
          <p>title: {data.get_post.title}</p>
          <p>description: {data.get_post.description}</p>
          <p>price: {data.get_post.price}</p>
          <p>color: {data.get_post.color}</p>
          <p>category: {data.get_post.category}</p>
          <p>mark: {data.get_post.mark}</p>
          { data.get_post.images?.map((img, index) => (
            <Image key={index} width={256} height={256} alt="salam" src={img} />
          ))}
        </div> :
        <p>no post</p>
      }
    </div>
  )
}
