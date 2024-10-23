const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// Replace 'YOUR_BOT_API_TOKEN' with the token you got from BotFather
const token = "7489704019:AAHYwElFgb-jluQuadtiqRIUNNciLNQZ2js";
const bot = new TelegramBot(token);

// Initialize polling for the bot
bot.setWebHook(`${process.env.URL}/.netlify/functions/bot`);

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.document) {
    const fileId = msg.document.file_id;

    try {
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const fileStream = await axios({
        method: "get",
        url: fileUrl,
        responseType: "stream",
      });

      bot.sendMessage(chatId, "File received successfully!");
    } catch (error) {
      console.error("Error downloading the file:", error);
      bot.sendMessage(chatId, "There was an error receiving your file.");
    }
  } else {
    bot.sendMessage(chatId, "Please send a file.");
  }
});

// Export the function handler for Netlify
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  if (body && body.message) {
    bot.processUpdate(body);
  }

  return {
    statusCode: 200,
    body: "ok",
  };
};
