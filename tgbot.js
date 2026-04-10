const TelegramBot = require('node-telegram-bot-api');

const token = '8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4';
const bot = new TelegramBot(token, {
  polling: true
});
const users = {};
const User = require('./User');

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
  const from = msg.from;
  const username = from.username;
  bot.sendMessage(msg.chat.id, 'Hello, ' + username + '!');
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
    await bot.sendPhoto(chatId, avatar, {
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
    bot.sendMessage(chatId, str, {
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error('TG Bot Error:', error);
    bot.sendMessage(chatId, "查询出错：" + error + "，请稍后再试...");
  }
});

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  const helpText = `VV助手是一个Telegram机器人，可以帮助你查询用户信息。<br>
当前可用命令：<br>
<code>/start</code> - 启动机器人
<code>/hello</code> - 测试命令，回复 "Hello, Telegram!"
<code>/queryuser <用户ID></code> - 查询用户信息，例如：<code>/queryuser 0</code>
<code>/help</code> - 显示帮助信息
<code>/about</code> - 关于VV助手
<code>/login 用户名 密码</code> - 登录并绑定Telegram，例如：<code>/login testuser testpassword</code><br>`;
  bot.sendMessage(chatId, helpText, { parse_mode: "HTML" });
});

bot.onText(/\/about/, (msg, match) => {
  const chatId = msg.chat.id;
  const aboutText = `VV助手 v1.0 by <a href=\"https://t.me/IFTCCEO\">@IFTCCEO</a>`;
  bot.sendMessage(chatId, aboutText, { parse_mode: "HTML" });
});

bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const uid = msg.from.id;
    if (!uid) return bot.sendMessage(chatId, "无法获取你的 Telegram 用户ID，请确保你已正确使用 /login 命令");
    const username = match[1];
    const password = match[2];
    console.log("Telegram Bot Received login command:", username, password);
    bot.sendMessage(chatId, "正在登录中，请稍后...");
    const r = await fetch("https://iftc.koyeb.app/api/user/login?user=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
    const j = await r.json();
    if (j.code != 200) return bot.sendMessage(chatId, j.msg);
    const j2 = await User.setTelegram(j.id, uid);
    if (j2.code != 200) return bot.sendMessage(chatId, "登录成功，但绑定 Telegram 失败：" + j2.msg);
    bot.sendMessage(chatId, "登录并绑定 Telegram 成功！");
  } catch (error) {
    console.error('TG Bot Login Error:', error);
    bot.sendMessage(chatId, "登录出错：" + error + "，请稍后再试...");
  }
});

bot.onText('whoami', )

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(" Telegram Bot Received message:", msg.text);
  if (msg.text.trim() == "/queryuser") return bot.sendMessage(chatId, "请输入用户ID以查询用户信息，如：/queryuser 0");
  if (msg.text.trim() == "/login") return bot.sendMessage(chatId, "请输入用户ID、用户名或邮箱和密码以登录VV账号，如：/login testuser testpassword");
  if (msg.text.startsWith("/")) return;
  bot.sendMessage(chatId, "未知命令，请使用 /help 获取帮助");
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  if (data === "help") {
    bot.sendMessage(chatId, "VV助手是一个Telegram机器人，可以帮助你查询用户信息。使用 /queryuser <用户ID> 来查询用户详情。例如：/queryuser 0\n输入 /help 以获取更多帮助");
  } else {
    bot.sendMessage(chatId, "未知操作");
  }
});

// 接收群组消息
bot.on('group_chat_created', (msg) => {
  console.log('Bot 被添加到新群组:', msg.chat.title);
});

bot.on('message', (msg) => {
  // 判断消息来源
  if (msg.chat.type === 'private') {
    console.log('私聊消息:', msg.text);
  } else if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    console.log('群组消息:', msg.text, '来自群组:', msg.chat.title);
  }
});

// 接收频道消息（Bot 需为频道管理员）
bot.on('channel_post', (msg) => {
  console.log('频道消息:', msg.text, '来自频道:', msg.chat.title);
});

// 接收频道编辑消息
bot.on('edited_channel_post', (msg) => {
  console.log('频道编辑消息:', msg.text);
});

/**
 * 转义 HTML 特殊字符
 * @param {String} text 
 * @returns 
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 时间戳格式化
 * @param {Number} timestamp 
 * @param {String} timezone 
 * @returns 
 */
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

module.exports = bot;