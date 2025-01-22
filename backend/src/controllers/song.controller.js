const Song = require("../models/song.model");
const errorHandler=require('../utils/error.js')


const getAllSongs=async(req,res)=>{
    try {
        const allSongs = await Song.find().sort({createdAt:-1})
        console.log("all songs are getting fetched")
        return res.status(200).json(allSongs);
    } catch (error) {
        console.log("Error in getting all songs", error);
        errorHandler(error,res);
    }
    
}

const getFeaturedSong=async(req,res)=>{
    try {
        const songs=await Song.aggregate([
            {$sample:{size:6}},
            {$project:{
                _id:1,
                title:1,
                artist:1,
                imageUrl:1,
                audioUrl:1
            }}
        ])
    
        return res.status(200).json(songs)
    } catch (error) {
        console.log("Error in getting featured songs", error);
        errorHandler(error,res);
    }
    
}

const getMadeForYou=async(req,res)=>{
    try {
        const songs=await Song.aggregate([
            {$sample:{size:4}},
            {$project:{
                _id:1,
                title:1,
                artist:1,
                imageUrl:1,
                audioUrl:1
            }}
        ])
    
        return res.status(200).json(songs)
    } catch (error) {
        console.log("Error in getting featured songs", error);
        errorHandler(error,res);
    }
}

const getTrendingSong=async(req,res)=>{
    try {
        const songs=await Song.aggregate([
            {$sample:{size:4}},
            {$project:{
                _id:1,
                title:1,
                artist:1,
                imageUrl:1,
                audioUrl:1
            }}
        ])
    
        return res.status(200).json(songs)
    } catch (error) {
        console.log("Error in getting featured songs", error);
        errorHandler(error,res);
    }
}


module.exports ={getAllSongs,getFeaturedSong,getMadeForYou,getTrendingSong}