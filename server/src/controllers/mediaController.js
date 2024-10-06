const ImageGenerator = require('../services/imageService/imageGenerator');
const TTSGenerator = require('../services/ttsService/ttsGenerator');
const VideoStitcher = require('../services/videoService/videoStitcher');
const tempDirManager = require('../utils/tempDirManager');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

const imageGenerator = new ImageGenerator();
const ttsGenerator = new TTSGenerator();
const videoStitcher = new VideoStitcher();

async function generateImagesForScript(script, regenerate = false) {
  logger.info(`${regenerate ? 'Regenerating' : 'Generating'} images for script:`, JSON.stringify(script));
  try {
    const { projectId, projectDir, imagesDir } = regenerate 
      ? tempDirManager.getProjectDir(script.id) 
      : tempDirManager.createProjectDir();
    
    // Save the script to a file
    const scriptPath = path.join(projectDir, 'script.json');
    fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));
    
    const scriptContext = `${script.title}\n${script.summary}`;
    const images = [];

    for (const scene of script.scenes) {
      try {
        const { base64Image, tempPath, originalFileName } = await imageGenerator.generateImage(scene.image, scene.number, scriptContext, imagesDir, regenerate);
        images.push({
          sceneNumber: scene.number,
          base64Image: base64Image,
          tempPath: tempPath,
          originalFileName: originalFileName
        });
      } catch (error) {
        logger.error(`Error generating image for scene ${scene.number}: ${error.message}`);
        logger.error(error.stack);
      }
    }

    return { 
      id: projectId,
      images: images
    };
  } catch (error) {
    logger.error(`Error in image generation process: ${error.message}`);
    logger.error(error.stack);
    throw error;
  }
}

async function confirmImagesForScript(scriptId, confirmedImages) {
  try {
    const { projectDir, imagesDir } = tempDirManager.getProjectDir(scriptId);
    const finalImages = [];

    for (const image of confirmedImages) {
      const finalFileName = `scene_${image.sceneNumber}${path.extname(image.originalFileName)}`;
      const finalPath = path.join(imagesDir, finalFileName);
      fs.renameSync(image.tempPath, finalPath);
      finalImages.push({
        sceneNumber: image.sceneNumber,
        imagePath: `/static/tempfiles/${path.basename(projectDir)}/${path.basename(imagesDir)}/${finalFileName}`
      });
    }

    return finalImages;
  } catch (error) {
    logger.error(`Error confirming images: ${error.message}`);
    logger.error(error.stack);
    throw error;
  }
}

async function generateVideoForScript(script, confirmedImages) {
  try {
    if (!script.id) {
      throw new Error('Script ID is missing');
    }
    const { projectId, projectDir, audioDir } = tempDirManager.getProjectDir(script.id);
    const mediaItems = [];

    // Read the saved script
    const scriptPath = path.join(projectDir, 'script.json');
    let savedScript = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));

    for (const scene of savedScript.scenes) {
      try {
        const confirmedImage = confirmedImages.find(img => img.sceneNumber === scene.number);
        if (!confirmedImage) {
          throw new Error(`No confirmed image for scene ${scene.number}`);
        }

        const { audioPath, durationInSeconds } = await ttsGenerator.generateAudio(scene.voiceover, scene.number, audioDir);

        // Update the script with the actual audio duration
        scene.audioDuration = durationInSeconds;

        mediaItems.push({
          sceneNumber: scene.number,
          imagePath: path.join(projectDir, 'images', path.basename(confirmedImage.imagePath)),
          audioPath: path.join(audioDir, path.basename(audioPath)),
          audioDuration: durationInSeconds
        });
      } catch (error) {
        logger.error(`Error generating media for scene ${scene.number}: ${error.message}`);
        logger.error(error.stack);
      }
    }

    // Save the updated script with audio durations
    fs.writeFileSync(scriptPath, JSON.stringify(savedScript, null, 2));

    const videoPath = await videoStitcher.stitchVideo(mediaItems, projectDir);

    return { 
      id: projectId, 
      videoPath: `/static/tempfiles/${path.basename(projectDir)}/${path.basename(videoPath)}`
    };
  } catch (error) {
    logger.error(`Error in video generation process: ${error.message}`);
    logger.error(error.stack);
    throw error;
  }
}

module.exports = {
  generateImagesForScript,
  confirmImagesForScript,
  generateVideoForScript
};