require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
};