const ImageGenerator = require('../imageGen/imageGenerator');
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');

const imageGenerator = new ImageGenerator();

async function generateImagesForScript(script) {
  const scriptContext = `${script.title}\n${script.summary}`;
  const images = [];

  for (const scene of script.scenes) {
    try {
      const image = await imageGenerator.generateImage(scene.image, scriptContext);
      images.push({
        sceneNumber: scene.number,
        imageUrl: image
      });
    } catch (error) {
      logger.error(`Error generating image for scene ${scene.number}: ${error.message}`);
    }
  }

  const uniqueId = uuidv4();
  return { id: uniqueId, images };
}

module.exports = {
  generateImagesForScript
};