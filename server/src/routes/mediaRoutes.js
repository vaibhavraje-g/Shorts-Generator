const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.post('/generate', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }
    const result = await mediaController.generateMediaForScript(script);
    res.json(result);
  } catch (error) {
    console.error('Error generating media:', error);
    res.status(500).json({ error: 'An error occurred while generating media' });
  }
});

router.post('/generate-images', async (req, res) => {
  try {
    const result = await mediaController.generateImagesForScript(req.body.script, req.body.regenerate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/confirm-images', async (req, res) => {
  try {
    const result = await mediaController.confirmImagesForScript(req.body.scriptId, req.body.confirmedImages);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-video', async (req, res) => {
  try {
    const { script, confirmedImages } = req.body;
    if (!script || !script.id || !confirmedImages) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    const result = await mediaController.generateVideoForScript(script, confirmedImages);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;