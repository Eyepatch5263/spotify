const express = require('express');
const { getStat } = require('../controllers/stat.controller');
const { protectedRoute, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/',protectedRoute,isAdmin, getStat)

module.exports = router