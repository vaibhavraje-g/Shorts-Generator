const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post('/generate', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }
    const result = await imageController.generateImagesForScript(script);
    res.json(result);
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'An error occurred while generating images' });
  }
});

module.exports = router;