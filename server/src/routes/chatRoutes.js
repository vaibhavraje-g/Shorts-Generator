const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to get all messages
router.get('/', (req, res) => {
  res.json(chatController.getMessages());
});

// Route to post a new message
router.post('/', (req, res) => {
  const message = chatController.addMessage(req.body);
  res.status(201).json(message);
});

module.exports = router;