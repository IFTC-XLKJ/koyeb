const TelegramBot = require('node-telegram-bot-api');

const token = '8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4';
const bot = new TelegramBot(token, {
  polling: true
});



bot.onText(/\/hello/, function onLoveText(msg) {
  bot.sendMessage(msg.chat.id, 'Hello, Telegram!');
});


bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

module.exports = bot;