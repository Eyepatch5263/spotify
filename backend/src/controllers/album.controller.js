const Album = require("../models/album.model")
const errorHandler=require('../utils/error.js')


const getAllAlbums=async(req,res)=>{
    try {
        const allAlbums = await Album.find()
        return res.status(200).json(allAlbums)
    } catch (error) {
        console.log("Error getting all albums", error)
        errorHandler(error,res)
    }
}

const getAlbumById=async(req,res)=>{
    try {
        const {albumId}=req.params
        const album = await Album.findById(albumId).populate("songs")
        return res.status(200).json(album)
    } catch (error) {
        console.log("Error getting album by Id", error)
        errorHandler(error,res)
    }
}

module.exports={getAllAlbums,getAlbumById}