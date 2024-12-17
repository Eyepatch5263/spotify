const User = require('../models/user.model');
const Message = require('../models/message.model');
const {errorHandler}=require('../utils/error.js')

const getAllUsers=async(req,res)=>{
    try {
        const currentUser=req.auth.userId
        const users=await User.find({clerkId:{$ne:currentUser}})
        return res.status(200).json(users)
    } catch (error) {
        console.error("Error getting all users", error);
        errorHandler(error,res)
    }
}

const getMessages=async(req,res)=>{
    try {
    const myId=req.auth.userId
    const {userId}=req.params
    const messages= await Message.find({$or:[{senderId:myId,receiverId:userId},{senderId:userId,receiverId:myId}]}).sort({createdAt:1})
    return res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        errorHandler(error,res)
    }
    
}
module.exports={getAllUsers,getMessages}
