const express = require('express');
const { deleteSong, createSong, createAlbum, deleteAlbum, checkAdmin } = require('../controllers/admin.controller');
const { protectedRoute, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protectedRoute, isAdmin)
router.get('/check', checkAdmin)
router.post('/songs', createSong)
router.delete('/songs/:id', deleteSong)

router.post('/albums', createAlbum)
router.delete('/albums/:id', deleteAlbum)

module.exports = router