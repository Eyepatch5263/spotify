const express = require('express');
const { getAllAlbums, getAlbumById } = require('../controllers/album.controller');
const router = express.Router();

router.get('/',getAllAlbums)
router.get("/:albumId",getAlbumById)

module.exports = router