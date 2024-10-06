const express = require('express');
const router = express.Router();

const chatRoutes = require('./chatRoutes');
const mediaRoutes = require('./mediaRoutes');

router.use('/chat', chatRoutes);
router.use('/media', mediaRoutes);

module.exports = router;