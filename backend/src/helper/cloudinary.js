const cloudinary=require('cloudinary').v2;
const dotenv= require('dotenv')

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary=async(file)=>{
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type:"auto",

        })
        return result.secure_url
    } catch (error) {
        console.log("Error uploading file: " + error.message)
        throw new Error("Error uploading to cloudinary: ")
    }
}

module.exports = {uploadToCloudinary}