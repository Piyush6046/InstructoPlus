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
    if (!filePath) return null
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto'
    })
    fs.unlinkSync(filePath)
    return uploadResult.secure_url
  } catch (error) {
    console.log(error)
    fs.unlinkSync(filePath)
    return null
  }
}
export default uploadOnCloudinary
