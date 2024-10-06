const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

class VideoStitcher {
  constructor() {
    this.outputDir = path.join(__dirname, '../../../output');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }
    
    // Set the path to FFmpeg
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    ffmpeg.setFfmpegPath(this.ffmpegPath);
  }

  async stitchVideo(mediaItems, projectDir) {
    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    logger.info(`Starting video stitching process for ${mediaItems.length} scenes`);
    logger.debug(`Media items: ${JSON.stringify(mediaItems)}`);
    
    const command = this.buildFFmpegCommand(mediaItems);
    
    return this.executeFFmpegCommand(command, outputPath, mediaItems.length);
  }

  buildFFmpegCommand(mediaItems) {
    let command = ffmpeg();
    let filterComplex = this.buildFilterComplex(mediaItems);

    mediaItems.forEach((item, index) => {
      logger.debug(`Adding input for scene ${item.sceneNumber}: Image: ${item.imagePath}, Audio: ${item.audioPath}`);
      if (!fs.existsSync(item.imagePath)) {
        logger.error(`Image file does not exist: ${item.imagePath}`);
      }
      if (!fs.existsSync(item.audioPath)) {
        logger.error(`Audio file does not exist: ${item.audioPath}`);
      }
      command = command
        .input(item.imagePath)
        .input(item.audioPath);
    });

    return command
      .complexFilter(filterComplex)
      .outputOptions(['-map [outv]', '-map [outa]', '-c:v libx264', '-c:a aac', '-b:a 192k', '-shortest']);
  }

  buildFilterComplex(mediaItems) {
    let filterComplex = [];
  
    mediaItems.forEach((item, index) => {
      filterComplex.push(`[${index * 2}:v]loop=loop=-1:size=1:start=0[v${index}];`);
    });

    // Concatenate video inputs
    filterComplex.push(`${mediaItems.map((_, i) => `[v${i}]`).join('')}concat=n=${mediaItems.length}:v=1:a=0[outv];`);

    // Concatenate audio inputs
    filterComplex.push(`${mediaItems.map((_, i) => `[${i * 2 + 1}:a]`).join('')}concat=n=${mediaItems.length}:v=0:a=1[outa]`);

    const finalFilterComplex = filterComplex.join('');
    logger.debug(`Filter complex: ${finalFilterComplex}`);
    return finalFilterComplex;
  }

  executeFFmpegCommand(command, outputPath, sceneCount) {
    return new Promise((resolve, reject) => {
      command.on('start', (commandLine) => {
        logger.info(`Starting FFmpeg process with ${sceneCount} scenes`);
        logger.debug(`FFmpeg command: ${commandLine}`);
      })
      .on('progress', (progress) => {
        logger.debug(`Processing: ${progress.percent}% done`);
      })
      .on('end', () => {
        logger.info(`Video stitching completed: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err, stdout, stderr) => {
        logger.error(`FFmpeg error: ${err.message}`);
        logger.error(`FFmpeg stdout: ${stdout}`);
        logger.error(`FFmpeg stderr: ${stderr}`);
        reject(err);
      })
      .on('stderr', (stderrLine) => {
        logger.debug(`FFmpeg stderr: ${stderrLine}`);
      })
      .save(outputPath);
    });
  }
}

module.exports = VideoStitcher;