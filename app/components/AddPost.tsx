"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_POST } from "../graphql/mutations";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("BLACK");
  const [category, setCategory] = useState("PANTS");
  const [mark, setMark] = useState("NIKE");
  const [imagesPath, setImagesPath] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [AddPostMutation] = useMutation(ADD_POST);

  const UploadImages = async () => {
    if (!images) return;
    const formData = new FormData();
    for (const file of images) {
      formData.append("files", file);
    }
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.files.map((file: { url: string }) => file.url);
  };


  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const images = await UploadImages();
      if (!images) throw new Error("در ذخیره عکس ها سرور به مشکل خورد");
      const data = await AddPostMutation({
        variables: {
          input: {
            title,
            description,
            price: parseFloat(price),
            color,
            category,
            mark,
            images_path: images,
          }
        }
      });
      if (data.error) {
        alert(data.error?.message);
        return;
      }
      alert("Post added successfully!");
      console.log(data.data);
      setTitle("");
      setDescription("");
      setPrice("");
      setColor("BLACK");
      setCategory("PANTS");
      setMark("NIKE");
      setImagesPath([]);
      setImages(null);
    } catch(err) {
      alert("An error occurred. Please try again.");
      console.error(err);
    }
  };

  const handleChangeImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImages(files);

    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(promises);
    setImagesPath(results);
  };

  return (
    <form onSubmit={handleAddPost}>
      <h2>test add post api</h2>
      <input
        type="text"
        placeholder="enter title ..."
        maxLength={64}
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <br />
      <textarea
        placeholder="enter description ..."
        maxLength={512}
        value={description}
        onChange={e => setDescription(e.target.value)} />
      <br />
      <input
        type="number"
        placeholder="enter price ..."
        value={price}
        onChange={e => setPrice(e.target.value)} />
      <br />
      <label htmlFor="Colors">Select Color</label>
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
      <label htmlFor="Cateogries">Select Category</label>
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
      <label htmlFor="Marks">Select Mark</label>
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
      <input type="file" multiple onChange={handleChangeImages} />
      <br />
      {imagesPath.map((image, index) => (
        <Image key={index} src={image} width={100} height={100} alt="s"  />
      ))}
      <br />
      <button type="submit">Submit</button>
    </form>
  )
}