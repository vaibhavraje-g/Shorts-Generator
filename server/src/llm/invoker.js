const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../logger');

class LLMInvoker {
  constructor(template) {
    this.template = template;
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  }

  async generate(input) {
    logger.info(`Generating response with template: ${this.template.name}`);
    logger.info(`Input: ${JSON.stringify(input)}`);

    try {
      const prompt = this.template.prompt.replace('{userMessage}', input.userMessage);
      
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: prompt }] }]
      });
      const response = result.response;
      const text = response.text();

      logger.info(`Generated response: ${text}`);
      return text;
    } catch (error) {
      logger.error(`Error generating response: ${error.message}`);
      return "I'm sorry, I encountered an error while processing your request.";
    }
  }
}

module.exports = LLMInvoker;