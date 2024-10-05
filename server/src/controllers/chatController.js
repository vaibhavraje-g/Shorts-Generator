const LLMInvoker = require('../llm/invoker');
const chatbotTemplate = require('../llm/templates/chatbot');
const scriptGeneratorTemplate = require('../llm/templates/scriptGenerator');

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
      let botResponse;
      let isScript = false;
      let scriptContent = null;

      if (msg.text.toLowerCase().includes('create a script') || msg.text.toLowerCase().includes('generate a script')) {
        const fullResponse = await scriptGeneratorInvoker.generate({ userMessage: msg.text });
        try {
          const parsedResponse = JSON.parse(fullResponse);
          if (parsedResponse.script && parsedResponse.response) {
            scriptContent = parsedResponse.script;
            botResponse = parsedResponse.response;
            isScript = true;
          } else {
            throw new Error('Invalid script format');
          }
        } catch (error) {
          console.error('Error parsing script JSON:', error);
          botResponse = "I'm sorry, I couldn't generate a proper script. Please try again.";
        }
      } else {
        botResponse = await chatbotInvoker.generate({ userMessage: msg.text });
      }

      const botMessage = {
        text: botResponse,
        fromUser: false,
        time: new Date(),
        isScript: isScript,
        scriptContent: scriptContent
      };
      messages.push(botMessage);
      return botMessage;
    } catch (error) {
      console.error('Error generating bot response:', error);
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