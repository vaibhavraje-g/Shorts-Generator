const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration');

class TTSGenerator {
  constructor() {
    this.mockAudioDir = path.join(__dirname, '../../mockData/audio');
    this.audioFiles = fs.readdirSync(this.mockAudioDir);
  }

  async generateAudio(text, sceneNumber, audioDir) {
    logger.info(`Generating audio for scene ${sceneNumber}: ${text}`);

    if (this.audioFiles.length === 0) {
      logger.error('No audio files found in the mockData/audio directory');
      throw new Error('No audio files available');
    }

    const audioFileName = this.audioFiles[sceneNumber % this.audioFiles.length];
    const sourceAudioPath = path.join(this.mockAudioDir, audioFileName);
    const destAudioPath = path.join(audioDir, `scene_${sceneNumber}${path.extname(audioFileName)}`);

    fs.copyFileSync(sourceAudioPath, destAudioPath);

    const durationInSeconds = await getAudioDurationInSeconds(destAudioPath);

    logger.info(`Audio generated for scene ${sceneNumber}: ${destAudioPath}`);
    return {
      audioPath: destAudioPath,  // Return the full path to the audio file
      durationInSeconds
    };
  }
}

module.exports = TTSGenerator;