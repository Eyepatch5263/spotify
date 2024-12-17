const express = require('express');
const router = express.Router();
const { authCallback } = require('../controllers/auth.controller');
router.post('/callback', authCallback)

module.exports = router