const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

class LLMInvoker {
  constructor(template) {
    this.template = template;
    this.mockScriptPath = path.join(__dirname, '../../mockData/scripts/sampleScript.json');
  }

  async generate(input) {
    logger.info(`Generating response with template: ${this.template.name}`);
    logger.info(`Input: ${JSON.stringify(input)}`);

    try {
      if (this.template.name === 'Script Generator') {
        const scriptContent = fs.readFileSync(this.mockScriptPath, 'utf8');
        const script = JSON.parse(scriptContent);
        return {
          response: "Here's a script based on your request.",
          script: script  
        };
      } else {
        return {
          response: "This is a mock response from the chatbot.",
          script: null
        };
      }
    } catch (error) {
      logger.error(`Error generating response: ${error.message}`);
      return {
        response: "I'm sorry, I encountered an error while processing your request.",
        script: null
      };
    }
  }
}

module.exports = LLMInvoker;