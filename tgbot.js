const TelegramBot = require('node-telegram-bot-api');

const token = '8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4';
const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const btns = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '访问官网',
            url: 'https://iftc.koyeb.app'
          }, {
            text: '获取帮助',
            callback_data: 'help'
          }
        ], [ // 第二行
          {
            text: '搜索内容',
            switch_inline_query: '默认搜索词'
          }
        ]
      ]
    }
  };
  bot.sendMessage(chatId, "欢迎使用VV助手", btns);
})

bot.onText(/\/hello/, function onLoveText(msg) {
  bot.sendMessage(msg.chat.id, 'Hello, Telegram!');
});


bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

module.exports = bot;