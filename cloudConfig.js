import "dotenv/config"; 
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["png", "jpg", "jpeg"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" }
    ]
  },
}); 


export { cloudinary, storage };