const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

const BASE_TEMP_DIR = path.join(__dirname, '../../tempfiles');

function createProjectDir() {
  // Create the base temp directory if it doesn't exist
  if (!fs.existsSync(BASE_TEMP_DIR)) {
    fs.mkdirSync(BASE_TEMP_DIR, { recursive: true });
    logger.info(`Created base temp directory: ${BASE_TEMP_DIR}`);
  }

  const projectId = uuidv4();
  const projectDir = path.join(BASE_TEMP_DIR, projectId);
  const imagesDir = path.join(projectDir, 'images');
  const audioDir = path.join(projectDir, 'audio');

  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });

  logger.info(`Created project directory: ${projectDir}`);

  return { projectId, projectDir, imagesDir, audioDir };
}

function getProjectDir(projectId) {
  const projectDir = path.join(BASE_TEMP_DIR, projectId);
  const imagesDir = path.join(projectDir, 'images');
  const audioDir = path.join(projectDir, 'audio');

  if (!fs.existsSync(projectDir)) {
    throw new Error(`Project directory not found: ${projectDir}`);
  }

  return { projectDir, imagesDir, audioDir };
}

module.exports = {
  createProjectDir,
  getProjectDir,
  BASE_TEMP_DIR
};