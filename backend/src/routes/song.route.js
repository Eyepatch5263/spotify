const express = require('express');
const { getAllSongs,getFeaturedSong,getMadeForYou,getTrendingSong } = require('../controllers/song.controller');
const { protectedRoute, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/',protectedRoute,isAdmin,getAllSongs)
router.get("/featured",getFeaturedSong)
router.get("/made-for-you",getMadeForYou)
router.get("/trending",getTrendingSong)

module.exports = router