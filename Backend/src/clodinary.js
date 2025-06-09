import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "src/.env", override: true })
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });

        console.log('file uploaded, file src: ' + response.url);
        fs.unlinkSync(localFilePath, (err) => {
            if (err) { console.log("Error deleteing file: ", err) }
            else {
                console.log("file deleted.",localFilePath);
            }
        })
        return response

    } catch (error) {
        console.log("error on cloudinary: ", error);
        fs.unlinkSync(localFilePath,(err) => {
            if(err){
                console.log("Error deleting file: ",err);
            }
            else {
                console("File deleted after error b4 response")
            }
        })
        return null
    }
}

const delFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Deleted from cloudinary: ",publicId);
    } catch (error) {
        console.log("Error deleting from cloudinary: ",error);
        return null
    }
}

export { uploadOnCloudinary, delFromCloudinary}