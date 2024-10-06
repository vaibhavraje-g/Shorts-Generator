const scriptGeneratorTemplate = {
  name: 'Script Generator',
  prompt: `Generate a script for a YouTube Shorts video about the following topic: {userMessage}. The video should be 30-60 seconds long.

  IMPORTANT: You MUST respond ONLY with a valid JSON object in the exact format specified below. Do not include any text outside of this JSON structure.

  {
    "response": "A brief acknowledgment of the user's request, no more than one sentence.",
    "script": {
      "title": "A catchy, attention-grabbing title for the video, maximum 10 words",
      "summary": "A concise summary of the video content, maximum 50 words",
      "scenes": [
        {
          "number": 1,
          "image": "A detailed description for image generation, about 20 words. Be specific and vivid.",
          "voiceover": "Exact text to be read as voice-over for this scene, about 30 words. Make it engaging and informative."
        },
        {
          "number": 2,
          "image": "A detailed description for image generation, about 20 words. Be specific and vivid.",
          "voiceover": "Exact text to be read as voice-over for this scene, about 30 words. Make it engaging and informative."
        }
      ]
    }
  }

  RULES:
  1. Create exactly 3 scenes. No more, no less.
  2. Each scene MUST focus on a key aspect of the requested topic.
  3. The script MUST be engaging, informative, and suitable for a short-form video.
  4. Ensure the total voiceover text across all scenes does not exceed 90 words.
  5. The image descriptions should be detailed enough for an AI image generator to create a vivid visual.
  6. Do not use placeholder text. Provide actual, interesting content for each field.
  7. Ensure all JSON keys and structure are exactly as shown in the example.

  Now, generate a unique script following these guidelines and format, based on the user's request: {userMessage}`,
};

module.exports = scriptGeneratorTemplate;