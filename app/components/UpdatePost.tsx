"use client";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { PostType } from "../types/post.type";
import { GET_POST } from "../graphql/queries";
import Image from "next/image";
import { UPDATE_POST } from "../graphql/mutations";

export default function UpdatePost() {
  const [postId, setPostId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [mark, setMark] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [nowImages, setNowImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [GetPost, { data: postData, loading: postLoading, error: postError }] = useLazyQuery<{ get_post: PostType }>(GET_POST);
  const [UpdatePost, { data: updateData, loading: updateLoading, error: updateError }] = useMutation<{ update_post: Boolean; }>(UPDATE_POST);
  
  useEffect(() => { 
    if (postData?.get_post) {
      setTitle(postData.get_post.title);
      setDescription(postData.get_post.description);
      setPrice(postData.get_post.price.toString());
      setColor(postData.get_post.color);
      setCategory(postData.get_post.category);
      setMark(postData.get_post.mark);
      if (postData.get_post.images)
        setImages(postData.get_post.images?.map((img: any) => img.path));
    }
  }, [postData]);

  const UploadNewImages = async () => {
    if (!newImages) return;
    const formData = new FormData();
    for (const file of newImages) {
      formData.append("files", file);
    }
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.files.map((file: any) => file.url);
  };

  const handleGetPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await GetPost({ variables: { id: parseInt(postId) } });
      console.log("ok");
    } catch(err) {
      alert(postError?.message);
    }
  };


  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const new_images: string[] = await UploadNewImages() || [];
      // if (!new_images) throw new Error("در هنگام ذخیره عکس ها مشکلی پیش آمد");
      
      await UpdatePost({ variables: {
        id: parseInt(postId),
        input: {
          title,
          description,
          price: parseInt(price),
          color,
          category,
          mark,
          images: [...new_images, ...images],
        }
      }});
    } catch(err) {
      console.error(err);
    }
  };

  const handleChangeImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewImages(files);

    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    const results = await Promise.all(promises);
    setNowImages(results);
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeleteNowImages = (index: number) => {
    setNowImages(nowImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>test update post API</h2>
      <form onSubmit={handleGetPost}>
        <input
          type="number"
          placeholder="enter post id ..."
          value={postId}
          onChange={e => setPostId(e.target.value)}
          readOnly={postData?.get_post ? true : false} />
        <button type="submit">get</button>
        { postLoading && <p>loading ...</p> }
        { postError && <p>error: {postError.message}</p> }
        { postData?.get_post && <p>Ok!</p> }
      </form>
      <form onSubmit={handleUpdatePost}>
        <input
          type="text"
          placeholder="edit title ..."
          value={title}
          onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea 
          placeholder="edit description ..."
          value={description}
          onChange={e => setDescription(e.target.value)} />
        <br />
        <input
          type="number"
          placeholder="edit price ..."
          value={price}
          onChange={e => setPrice(e.target.value)} />
        <br />
        <label htmlFor="Colors">Edit Color</label>
        <select
          id="Colors"
          value={color}
          onChange={e => setColor(e.target.value)} >
          <option value="BLACK">BLACK</option>
          <option value="WHITE">WHITE</option>
          <option value="GREEN">GREEN</option>
          <option value="RED">RED</option>
          <option value="BLUE">BLUE</option>
          <option value="PURPLE">PURPLE</option>
          <option value="BROWN">BROWN</option>
          <option value="PINK">PINK</option>
          <option value="YELLOW">YELLOW</option>
          <option value="ORANGE">ORANGE</option>
          <option value="AQUA">AQUA</option>
          <option value="SMOKE_WHITE">SMOKE_WHITE</option>
        </select>
        <br />
        <label htmlFor="Cateogries">Edit Category</label>
        <select
          id="Categories"
          value={category}
          onChange={e => setCategory(e.target.value)} >
          <option value="PANTS">PANTS</option>
          <option value="SUIT">SUIT</option>
          <option value="SHIRT">SHIRT</option>
          <option value="TSHIRT">TSHIRT</option>
          <option value="DRESS">DRESS</option>
          <option value="SKIRT">SKIRT</option>
          <option value="JACKET">JACKET</option>
          <option value="COAT">COAT</option>
          <option value="SHOES">SHOES</option>
          <option value="HAT">HAT</option>
          <option value="BAG">BAG</option>
          <option value="ACCESSORY">ACCESSORY</option>
        </select>
        <br />
        <label htmlFor="Marks">Edit Mark</label>
        <select
          id="Marks"
          value={mark}
          onChange={e => setMark(e.target.value)} >
          <option value="NIKE">NIKE</option>
          <option value="ADIDAS">ADIDAS</option>
          <option value="PUMA">PUMA</option>
          <option value="REEBOK">REEBOK</option>
          <option value="VANS">VANS</option>
          <option value="CONVERSE">CONVERSE</option>
          <option value="NEW_BALANCE">NEW_BALANCE</option>
          <option value="UNDER_ARMOUR">UNDER_ARMOUR</option>
          <option value="LACOSTE">LACOSTE</option>
          <option value="GUCCI">GUCCI</option>
          <option value="PRADA">PRADA</option>
          <option value="CHANEL">CHANEL</option>
          <option value="LOUIS_VUITTON">LOUIS_VUITTON</option>
          <option value="HERMES">HERMES</option>
          <option value="BURBERRY">BURBERRY</option>
        </select>
        <br />
        {images.map((img, index) => (
          <div key={index}>
            <Image width={256} height={256} alt="salam" src={img} />
            <button type="button" onClick={() => handleDelete(index)}>delete</button>
          </div>
        ))}
        {nowImages.map((img, index) => (
          <div key={index}>
            <Image width={256} height={256} alt="salam" src={img} />
            <button type="button" onClick={() => handleDeleteNowImages(index)}>delete</button>
          </div>
        ))}
        <label htmlFor="file">Add Images</label>
        <input onChange={handleChangeImages} id="file" type="file" multiple hidden />
        <br />
        <br />
        <br />
        <button type="submit">update post</button>
      </form>
      <div>
        { updateError && <p>Update Error: {updateError.message} </p> }
        { updateLoading && <p>UpdateLoading ...</p> }
        { updateData?.update_post && <p>Result Ok</p> }
      </div>
    </div>
  )
}