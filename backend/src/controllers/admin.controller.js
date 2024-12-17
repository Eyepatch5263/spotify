const Song = require('../models/song.model.js')
const Album = require('../models/album.model.js')
const { uploadToCloudinary } = require('../helper/cloudinary.js')
const { errorHandler } = require('../utils/error.js')


const createSong = async (req, res) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files and images" })
        }

        const { title, artist, albumId, duration } = req.body
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        const audioUrl = await uploadToCloudinary(audioFile)
        const imageUrl = await uploadToCloudinary(imageFile)

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        })

        await song.save()

        //if song belongs to album
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            })
        }
        return res.status(200).json(song)

    } catch (error) {
        console.log("Error in creating song", error)
        errorHandler(error, res)
    }
}

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params
        const song = await Song.findById(id)

        //if the song belongs to some album, the album should be updated
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: {
                    songs: song._id
                }
            })
        }
        await Song.findByIdAndDelete(id)
        res.status(200).json({ message: "Song deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error ", error })
    }
}

const createAlbum = async (req, res) => {
    try {
        const { title, artist, releaseYear } = req.body
        const imageFile = req.files.imageFile
        const imageUrl = await uploadToCloudinary(imageFile)
        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })
        album.save()
        res.status(200).json(album)
    } catch (error) {
        console.log("Error is creating the Album", error)
        errorHandler(error, res)
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params
        await Song.deleteMany({ albumId: id })
        await Album.findByIdAndDelete(id)
        res.status(200).json({ message: "Album deleted successfully" })
    } catch (error) {
        console.log("Error in deleting the Album", error)
        errorHandler(error, res)
    }
}

const checkAdmin = (req, res, next) => {
    res.status(200).json({ admin: true })
}


module.exports = { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin }