import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Updated to accept Buffer instead of file path
const uploadOnCloudinary = async (fileBuffer) => {
  if (!fileBuffer) return null;

  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "urbanfix-reports"
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", error.message);
            reject(error);
          } else {
            console.log("✅ Uploaded to Cloudinary:", result.url);
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    return null;
  }
};

export { uploadOnCloudinary };
