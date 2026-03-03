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
        [{
          text: '访问官网',
          url: 'https://iftc.koyeb.app'
        }, {
          text: '获取帮助',
          callback_data: 'help'
        }], []
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

bot.onText(/\/queryuser (.+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const resp = match[1];
    const ID = Number(resp);
    if (ID.trim() == "") return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    if (isNaN(ID)) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    if (ID < 0) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    bot.sendMessage(chatId, "正在查询中，请稍后...");
    const r = await fetch("https://iftc.koyeb.app/api/user/details?id=" + ID);
    const j = await r.json();
    bot.sendMessage(chatId, JSON.stringify(j, null, 4));
  } catch(error) {
    console.error('TG Bot Error:', error);
    bot.sendMessage(chatId, "查询出错：" + error + "，请稍后再试...");
  }
});

bot.onText(/\/queryuser/, (msg, match) => {
  const chatId = msg.chat.id;
  return bot.sendMessage(chatId, "请输入用户ID以查询用户信息");
});

module.exports = bot;