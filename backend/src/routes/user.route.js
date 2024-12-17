const express = require('express');
const { protectedRoute } = require('../middleware/auth.middleware');
const { getAllUsers, getMessages } = require('../controllers/user.controller');

const router = express.Router();
router.get('/',protectedRoute,getAllUsers)
router.get('/messages/:userId',protectedRoute,getMessages)

module.exports = router;