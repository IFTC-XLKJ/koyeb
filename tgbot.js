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
    const str = `<b>用户 ID：</b><code>${data.ID}</code>
<b>用户名：</b><code>${data.username}</code>
<b>邮箱：</b><code>${escapeHtml(data.email)}</code>
<b>V 币：</b><code>${data.VC}</code>
<b>VIP：</b><code>${data.VIP ? "是" : "否"}</code>
<b>管理员：</b><code>${data.op ? "是" : "否"}</code>
<b>冻结：</b><code>${data.freezed ? "是" : "否"}</code>
<b>头衔：</b><code>${data.title}</code>
<b>头衔色：</b><code>${data.titleColor}</code>
<b>上次签到时间：</b><code>${formatTimestamp(data.signed, 'Asia/Shanghai')}</code>
<b>注册时间：</b><code>${formatTimestamp(data.createdAt * 1000, 'Asia/Shanghai')}</code>
<b>更新时间：</b><code>${formatTimestamp(data.updatedAt * 1000, 'Asia/Shanghai')}</code>`;
    // bot.sendMessage(chatId, JSON.stringify(j, null, 4));
    bot.sendMessage(chatId, str, {
      parse_mode: "HTML"
    });
  } catch (error) {
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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.startsWith("/")) return;
  bot.sendMessage(chatId, "未知命令，请使用 /help 获取帮助");
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  if (data === "help") {
    bot.sendMessage(chatId, "VV助手是一个Telegram机器人，可以帮助你查询用户信息。使用 /queryuser <用户ID> 来查询用户详情。例如：/queryuser 0");
  } else {
    bot.sendMessage(chatId, "未知操作");
  }
});

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTimestamp(timestamp, timezone) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

// 使用示例
const timestamp = 1735689600000; // 毫秒时间戳 (2025-01-01 00:00:00 UTC)

console.log(formatTimestamp(timestamp, 'Asia/Shanghai'));

module.exports = bot;