const LLMInvoker = require('../services/llmService/invoker');
const chatbotTemplate = require('../services/llmService/templates/chatbot');
const scriptGeneratorTemplate = require('../services/llmService/templates/scriptGenerator');
const logger = require('../utils/logger');

let messages = [];

const chatbotInvoker = new LLMInvoker(chatbotTemplate);
const scriptGeneratorInvoker = new LLMInvoker(scriptGeneratorTemplate);

function getMessages() {
  return messages;
}

async function addMessage(msg) {
  const message = {
    text: msg.text,
    fromUser: msg.fromUser,
    time: new Date()
  };
  messages.push(message);

  if (msg.fromUser) {
    try {
      let response;
      if (msg.text.toLowerCase().includes('script') || msg.text.toLowerCase().includes('generate')) {
        response = await scriptGeneratorInvoker.generate({ userMessage: msg.text });
      } else {
        response = await chatbotInvoker.generate({ userMessage: msg.text });
      }
      
      const botMessage = {
        text: response.response,
        fromUser: false,
        time: new Date(),
        isScript: !!response.script,
        scriptContent: response.script
      };
      messages.push(botMessage);
      return botMessage;
    } catch (error) {
      logger.error('Error generating bot response:', error);
      return {
        text: "I'm sorry, I encountered an error while processing your request.",
        fromUser: false,
        time: new Date()
      };
    }
  }

  return message;
}

function clearMessages() {
  messages = [];
}

module.exports = {
  getMessages,
  addMessage,
  clearMessages
};