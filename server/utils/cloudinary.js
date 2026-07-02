require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

 console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (localFilePath) => {
  try {
    // console.log("Cloudinary",process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET,localFilePath);

    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    // ✅ delete temp file after successful upload
    fs.unlinkSync(localFilePath);

    // console.log("Uploaded:", result.secure_url);

    // ✅ return only the URL
    return result.secure_url;

  } catch (error) {
    console.log("Cloudinary error:", error);

    // delete file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

module.exports = { UploadOnCloudinary };