"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_POST } from "../graphql/mutations";

export default function DeletePost() {
  const [postId, setPostId] = useState("");
  const [DeletePost, { data, loading, error }] = useMutation<{ delete_post: boolean }>(DELETE_POST);

  const handleDelete = async () => {
    try {
      await DeletePost({ variables: {
        id: parseInt(postId)
      }});
      alert("ok");
    } catch(err) {
      alert(`error: ${err}`);
      console.error(error?.message)
    }
  };

  return (
    <div>
      <h2>Test Delete Post API</h2>
      <input
        type="number"
        placeholder="enter post id ..."
        value={postId}
        onChange={e => setPostId(e.target.value)} />
      <button onClick={handleDelete}>Delete</button>
      {loading && <p>Loading ....</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.delete_post ? <p>Ok</p> : <p>No Delete Post</p>}
    </div>
  )
}