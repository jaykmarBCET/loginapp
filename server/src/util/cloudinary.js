import {v2 as cloudinary } from 'cloudinary'
import fs from  'fs/promises'
import {ApiError} from './ApiError.js'
import dotenv from 'dotenv'

dotenv.config();



cloudinary.config({ 
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        await fs.unlink(localFilePath);
        return response;
    } catch (error) {
        await fs.unlink(localFilePath);
        console.error("Error uploading to Cloudinary:", error);
        throw new ApiError(500, 'Upload to Cloudinary failed');
    }
};



export { uploadOnCloudinary}
