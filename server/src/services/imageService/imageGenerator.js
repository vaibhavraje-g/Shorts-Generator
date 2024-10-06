const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

class ImageGenerator {
  constructor() {
    this.mockImagesDir = path.join(__dirname, '../../mockData/images');
    this.imageFiles = fs.readdirSync(this.mockImagesDir);
  }

  async generateImage(prompt, sceneNumber, scriptContext, tempImagesDir, regenerate = false) {
    logger.info(`${regenerate ? 'Regenerating' : 'Generating'} image for scene ${sceneNumber}: ${prompt}`);

    if (this.imageFiles.length === 0) {
      logger.error('No image files found in the mockData/images directory');
      throw new Error('No image files available');
    }

    let sourceImageFileName;
    if (regenerate) {
      // Choose a different image for regeneration
      const availableImages = this.imageFiles.filter(file => !file.includes(`scene_${sceneNumber}`));
      sourceImageFileName = availableImages[Math.floor(Math.random() * availableImages.length)];
    } else {
      sourceImageFileName = this.imageFiles[sceneNumber % this.imageFiles.length];
    }

    const sourceImagePath = path.join(this.mockImagesDir, sourceImageFileName);
    const tempImageFileName = `temp_scene_${sceneNumber}${path.extname(sourceImageFileName)}`;
    const tempImagePath = path.join(tempImagesDir, tempImageFileName);

    fs.copyFileSync(sourceImagePath, tempImagePath);

    // Read the image file as a base64 encoded string
    const imageBuffer = fs.readFileSync(tempImagePath);
    const base64Image = imageBuffer.toString('base64');

    logger.info(`Image ${regenerate ? 'regenerated' : 'generated'} for scene ${sceneNumber}: ${tempImagePath}`);
    return {
      base64Image: `data:image/${path.extname(sourceImageFileName).slice(1)};base64,${base64Image}`,
      tempPath: tempImagePath,
      originalFileName: sourceImageFileName
    };
  }
}

module.exports = ImageGenerator;