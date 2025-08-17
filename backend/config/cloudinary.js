import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  try {
    if (!filePath) return null;

    const options = {
      resource_type: 'auto',
    };

    // Check if the file is a document (e.g., pdf, docx) to force download
    const isDocument = /\.(pdf|docx?|txt|pptx?)$/i.test(filePath);
    if (isDocument) {
      options.resource_type = 'raw';
      options.flags = 'attachment';
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, options);
    fs.unlinkSync(filePath);

    if (isDocument) {
      // Manually construct the URL with the fl_attachment flag and the original filename
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const publicId = uploadResult.public_id;
      const originalFilename = filePath.split('\\').pop().split('/').pop();
      return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment:${originalFilename}/${publicId}`;
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.log(error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
}
export default uploadOnCloudinary
