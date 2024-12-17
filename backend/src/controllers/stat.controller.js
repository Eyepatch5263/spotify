const Album = require('../models/album.model')
const Song = require('../models/song.model')
const User = require('../models/user.model')
const errorHandler = require('../utils/error.js')

const getStat = async (req, res) => {
    try {
        const [totalSongs, totalUsers, totalAlbums, uniqueArtist] = await Promise.all([
            Song.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),
            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    },
                },
                {
                    $group: {
                        _id: "$artist"
                    },
                },
                {
                    $count: "count"
                }
            ])
        ])
        return res.status(200).json({totalSongs, totalUsers, totalAlbums, totalArtist:uniqueArtist[0]?.count || 0})
    } catch (error) {
        console.log("Error in getting stats", error)
        errorHandler(error, res)
    }
}

module.exports = { getStat }