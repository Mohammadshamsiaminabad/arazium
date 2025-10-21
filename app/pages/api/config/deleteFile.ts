import fs from "fs";

export default function deleteFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("file deleted:", filePath);
    } else {
      console.log("File not found: ", filePath);
    }
  } catch(err) {
    console.error("Error Deleting file:", err);
  }
}