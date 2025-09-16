import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUD_API_SECRET,
  api_key: process.env.CLOUD_API_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // uplodaing file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded on cloudinary successfully
    console.log("File is uploaded on cloudinary", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // removed the temporary localFilePath file as the operation got failed
    console.log(error);
    return null;
  }
};

const destroyOnCloudinary = async (publicIdPath) => {
  try {
    await cloudinary.uploader.destroy(publicIdPath, { resource_type: "video" });
    console.log("File is Deleted successfully");
  } catch (error) {
    console.log(error?.message);
    return null;
  }
};

export { uploadOnCloudinary, destroyOnCloudinary };
