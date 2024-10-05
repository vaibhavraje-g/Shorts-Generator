const chatController = require('./controllers/chatController');
const logger = require('./logger');

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    logger.info('New client connected');

    // Clear messages when a new client connects
    chatController.clearMessages();

    // Send existing messages to the client
    socket.emit('previous messages', chatController.getMessages());

    // Listen for new messages
    socket.on('new message', async (msg) => {
      const userMessage = await chatController.addMessage(msg);
      io.emit('new message', userMessage); // Broadcast user message to all connected clients
      logger.info(`New message from user: ${msg.text}`);

      if (msg.fromUser) {
        const botMessage = await chatController.addMessage({
          text: '',
          fromUser: false,
          time: new Date()
        });
        io.emit('new message', botMessage); // Broadcast bot response to all connected clients
        logger.info(`Bot response: ${botMessage.text}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
}

module.exports = setupSocketIO;