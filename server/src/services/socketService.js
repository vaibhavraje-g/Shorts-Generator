const chatController = require('../controllers/chatController');
const logger = require('../utils/logger');

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    logger.info('New client connected');

    // Send existing messages to the client
    socket.emit('previous messages', chatController.getMessages());

    // Listen for new messages
    socket.on('new message', async (msg) => {
      const message = await chatController.addMessage(msg);
      io.emit('new message', message); // Broadcast message to all connected clients
      logger.info(`New message: ${msg.text}`);
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
}

module.exports = setupSocketIO;