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
  const chatId = msg.chat.id;
  try {
    const resp = match[1];
    const ID = Number(resp);
    if (resp.trim() == "") return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    if (isNaN(ID)) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    if (ID < 0) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
    bot.sendMessage(chatId, "正在查询中，请稍后...");
    const r = await fetch("https://iftc.koyeb.app/api/user/details?id=" + ID);
    const j = await r.json();
    if (j.code != 200) return bot.sendMessage(chatId, j.msg);
    const data = j.data;
    const avatar = data.avatar;
    bot.sendPhoto(chatId, avatar, {
      caption: ""
    });
    const str = `<div>用户ID：${data.ID}
用户名：${data.username}
邮箱：${data.email}
V币：${data.VC}
VIP：${data.VIP ? "是" : "否"}
管理员：${data.op ? "是" : "否"}
冻结：${data.freezed ? "是" : "否"}
头衔：${data.title}
头衔色：<div style="background-color: ${data.titleColor};">${data.titleColor}</div>
上次签到时间：${formatTimestamp(data.signed, 'Asia/Shanghai')}
注册时间：${formatTimestamp(data.createdAt * 1000, 'Asia/Shanghai')}
更新时间：${formatTimestamp(data.updatedAt * 1000, 'Asia/Shanghai')}</div>`;
    // bot.sendMessage(chatId, JSON.stringify(j, null, 4));
    bot.sendMessage(chatId, str, {
      parse_mode: "HTML"
    });
  } catch(error) {
    console.error('TG Bot Error:', error);
    bot.sendMessage(chatId, "查询出错：" + error + "，请稍后再试...");
  }
});

/*
bot.onText(/\/queryuser/, (msg, match) => {
  const chatId = msg.chat.id;
  return bot.sendMessage(chatId, "请输入用户ID以查询用户信息");
});
*/

function formatTimestamp(timestamp, timezone) {
  // 1. 创建 Date 对象
  // 注意：如果 timestamp 是秒级（10位），需要 * 1000 转为毫秒
  const date = new Date(timestamp); 

  // 2. 使用 Intl 进行时区格式化
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone, // 关键参数：指定目标时区
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 使用24小时制
    // timeZoneName: 'short' // 如果需要显示时区缩写（如 CST, PST）
  }).format(date);
}

// 使用示例
const timestamp = 1735689600000; // 毫秒时间戳 (2025-01-01 00:00:00 UTC)

console.log(formatTimestamp(timestamp, 'Asia/Shanghai')); 

module.exports = bot;