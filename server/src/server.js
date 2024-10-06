const { app, server } = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
