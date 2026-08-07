import TelegramBot from "node-telegram-bot-api";
import User from "./User.ts";

const user = new User();

console.log("Telegram Bot is starting...");

const token = process.env.TG_BOT_TOKEN || "8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4";
const bot = new TelegramBot(token, { polling: true });

// ========== 工具函数 ==========

function escapeHtml(text: string): string {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatTimestamp(timestamp: number, timezone: string): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("zh-CN", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(date);
}

// ========== 命令处理 ==========

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, "欢迎使用VV���手", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "访问官网", url: "https://iftc.koyeb.app" },
                    { text: "获取帮助", callback_data: "help" },
                ],
            ],
        },
    });
});

bot.onText(/\/hello/, (msg) => {
    const username = msg.from?.username ?? "未知用户";
    return bot.sendMessage(msg.chat.id, `Hello, @${username}!`);
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    return bot.sendMessage(msg.chat.id, match[1]);
});

bot.onText(/\/about/, (msg) => {
    return bot.sendMessage(msg.chat.id, "VV助手 v1.0 by @IFTCCEO", { parse_mode: "HTML" });
});

bot.onText(/\/help/, (msg) => {
    const helpText = `VV助手是一个Telegram机器人，可以帮助你查询用户信息。<br>
当前可用命令：<br>
<code>/start</code> - 启动机器人
<code>/hello</code> - 测试命令，回复 "Hello, Telegram!"
<code>/queryuser <用户ID></code> - 查询用户信息，例如：<code>/queryuser 0</code>
<code>/help</code> - 显示帮助信息
<code>/about</code> - 关于VV助手
<code>/login 用户名 密码</code> - 登录并绑定Telegram，例如：<code>/login testuser testpassword</code><br>`;
    return bot.sendMessage(msg.chat.id, helpText, { parse_mode: "HTML" });
});

bot.onText(/\/queryuser (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    try {
        const resp = match[1].trim();
        const id = Number(resp);

        if (!resp) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");
        if (isNaN(id) || id < 0) return bot.sendMessage(chatId, "请输入有效的用户ID，如：0");

        bot.sendMessage(chatId, "正在查询中，请稍后...");

        const r = await fetch(`https://iftc.koyeb.app/api/user/details?id=${id}`);
        const j = await r.json();
        if (j.code !== 200) return bot.sendMessage(chatId, j.msg);

        const data = j.data;
        await bot.sendPhoto(chatId, data.avatar, { caption: "" });

        const str = `<b>用户 ID：</b><code>${data.ID}</code>
<b>用户名：</b><code>${data.username}</code>
<b>邮箱：</b><code>${escapeHtml(data.email)}</code>
<b>V 币：</b><code>${data.VC}</code>
<b>VIP：</b><code>${data.VIP ? "是" : "否"}</code>
<b>管理员：</b><code>${data.op ? "是" : "否"}</code>
<b>冻结：</b><code>${data.freezed ? "是" : "否"}</code>
<b>头衔：</b><code>${data.title}</code>
<b>头衔色：</b><code>${data.titleColor}</code>
<b>上次签到时间：</b><code>${formatTimestamp(data.signed, "Asia/Shanghai")}</code>
<b>注册时间：</b><code>${formatTimestamp(data.createdAt * 1000, "Asia/Shanghai")}</code>
<b>更新时间：</b><code>${formatTimestamp(data.updatedAt * 1000, "Asia/Shanghai")}</code>`;

        return bot.sendMessage(chatId, str, { parse_mode: "HTML" });
    } catch (error) {
        console.error("TG Bot Error:", error);
        return bot.sendMessage(chatId, `查询出错：${error}，请稍后再试...`);
    }
});

bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const from = msg.from;
    if (!from) return;

    try {
        const uid = from.id;
        if (!uid) {
            return bot.sendMessage(chatId, "无法获取你的 Telegram 用户ID，请确保你已正确使用 /login 命令");
        }

        const username = match[1];
        const password = match[2];
        console.log("Telegram Bot Received login command:", username, password);

        bot.sendMessage(chatId, "正在登录中，请稍后...");

        const r = await fetch(
            `https://iftc.koyeb.app/api/user/login?user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        );
        const j = await r.json();
        if (j.code !== 200) return bot.sendMessage(chatId, j.msg);

        const id = j.id;
        const j2 = await user.setTelegram(id, uid);
        if (j2.code !== 200) {
            return bot.sendMessage(chatId, `登录成功，但绑定 Telegram 失败：${j2.msg}`);
        }

        bot.sendMessage(chatId, "登录并绑定 Telegram 成功！");
    } catch (error) {
        console.error("TG Bot Login Error:", error);
        return bot.sendMessage(chatId, `登录出错：${error}，请稍后再试...`);
    }
});

// ========== 回调查询 ==========

bot.on("callback_query", (query) => {
    const message = query.message;
    if (!message) return;

    const chatId = message.chat.id;
    if (query.data === "help") {
        return bot.sendMessage(
            chatId,
            "VV助手是一个Telegram机器人，可以帮助你查询用户信息。使用 /queryuser <用户ID> 来查询用户详情。例如：/queryuser 0\n输入 /help 以获取更多帮助",
        );
    }
    return bot.sendMessage(chatId, "未知操作");
});

// ========== 通用消息处理 ==========

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // 日志
    if (msg.chat.type === "private") {
        console.log("私聊消息:", text);
    } else if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        console.log("群组消息:", text, "来自群组:", msg.chat.title);
    }

    if (!text) return;

    // 无参数命令提示
    if (text.trim() === "/queryuser") {
        return bot.sendMessage(chatId, "请输入用户ID以查询用户信息，如：/queryuser 0");
    }
    if (text.trim() === "/login") {
        return bot.sendMessage(
            chatId,
            "请输入用户名和密码以登录VV账号，如：/login testuser testpassword",
        );
    }

    // 已注册命令跳过
    if (text.startsWith("/")) return;

    return bot.sendMessage(chatId, "未知命令，请使用 /help 获取帮助");
});

// ========== 频道/群组事件 ==========

bot.on("group_chat_created", (msg) => {
    console.log("Bot 被添加到新群组:", msg.chat.title);
});

bot.on("channel_post", (msg) => {
    console.log("频道消息:", msg.text, "来自频道:", msg.chat.title);
});

bot.on("edited_channel_post", (msg) => {
    console.log("频道编辑消息:", msg.text);
});

console.log("Telegram Bot started.");

export default bot;
export { TelegramBot };
