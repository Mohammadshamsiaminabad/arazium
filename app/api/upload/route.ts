import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  const uploadedFiles: { filename: string; url: string }[] = [];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webpFilename = `${Date.now()}-${file.name.split(".")[0]}.webp`;
    const uploadDir = path.join(process.cwd(), "public/uploads", webpFilename);

    await sharp(buffer).toFormat("webp").toFile(uploadDir);

    uploadedFiles.push({ filename: webpFilename, url: `/uploads/${webpFilename}` });
  }

  return Response.json({ files: uploadedFiles });
}