import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from 'dotenv';
dotenv.config();
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadonCloudinary=async(localfilePath)=>{
        try {
            if(!localfilePath) return null;
           const response=await  cloudinary.uploader.upload(localfilePath,{
                resource_type:'auto'
            })
            console.log("file uploaded successfully",response.secure_url,"response")
            fs.unlinkSync(localfilePath)
            return response;
        } catch (error) {
            console.log("cloudinary upload error",error)
            fs.unlinkSync(localfilePath)
            return null;
        }
    }

    export default uploadonCloudinary