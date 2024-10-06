const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path'); // Add this line
const { PORT, FRONTEND_URL } = require('./config/environment');
const { BASE_TEMP_DIR } = require('./utils/tempDirManager');

const setupSocketIO = require('./services/socketService');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [FRONTEND_URL],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use('/static', express.static(BASE_TEMP_DIR));
app.use('/static', express.static(path.join(__dirname, 'mockData')));

// Setup Socket.IO
setupSocketIO(io);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = { app, server };