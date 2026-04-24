import TelegramBot from "node-telegram-bot-api";

console.log("Telegram Bot is starting...");

const token: string = "8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4";
const bot = new TelegramBot(token, {
    polling: true,
});

bot.on("message", async (msg: TelegramBot.Message): Promise<void> => {
    const chatId: number = msg.chat.id;
    const text: string | undefined = msg.text;
    const photo: TelegramBot.PhotoSize[] | undefined = msg.photo;
    if (text) {
        console.log("Received message from chat ID", chatId, ":", text);
    }
    if (photo && photo.length > 0) {
        try {
            const fileId: string = photo[photo.length - 1].file_id;
            const fileLink: string = await bot.getFileLink(fileId);
            console.log("Image URL:", fileLink);
            const response = await fetch(fileLink);
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            console.log("Image size:", imageBuffer.length, "bytes");
            // fs.writeFileSync('received_photo.jpg', imageBuffer);
            // await bot.sendMessage(chatId, "图片已收到！");
        } catch (error) {
            console.error("Failed to download image:", error);
        }
    }
});

bot.onText(/\/start/, (msg: TelegramBot.Message, match: any): Promise<TelegramBot.Message> => {
    const chatId: number = msg.chat.id;
    const btns: Object = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "访问官网",
                        url: "https://iftc.koyeb.app",
                    },
                    {
                        text: "获取帮助",
                        callback_data: "help",
                    },
                ],
                [],
            ],
        },
    };
    return bot.sendMessage(chatId, "欢迎使用VV助手", btns);
});

bot.onText(/\/hello/, function onLoveText(msg: TelegramBot.Message): Promise<TelegramBot.Message> {
    const from: TelegramBot.User | undefined = msg.from;
    const username: string = from?.username ?? "未知用户";
    return bot.sendMessage(msg.chat.id, "Hello, @" + username + "!");
});

bot.onText(/\/echo (.+)/, (msg: TelegramBot.Message, match: any): Promise<TelegramBot.Message> => {
    const chatId: number = msg.chat.id;
    const resp: string = match[1];
    return bot.sendMessage(chatId, resp);
});

bot.onText(/\/about/, (msg: TelegramBot.Message, match: any): Promise<TelegramBot.Message> => {
    const chatId: number = msg.chat.id;
    const aboutText: string = `VV助手 v1.0 by @IFTCCEO`;
    return bot.sendMessage(chatId, aboutText, { parse_mode: "HTML" });
});

// bot.onText("whoami", async function (msg) {});

bot.on(
    "message",
    (
        msg: TelegramBot.Message,
        metadata: TelegramBot.Metadata,
    ): Promise<TelegramBot.Message> | undefined => {
        const chatId: number = msg.chat.id;
        const text: string = msg.text || "";
        if (!text) return;
        console.log(" Telegram Bot Received message:", msg.text);
        if (text.trim() == "/queryuser")
            return bot.sendMessage(chatId, "请输入用户ID以查询用户信息，如：/queryuser 0");
        if (text.trim() == "/login")
            return bot.sendMessage(
                chatId,
                "请输入用户ID、用户名或邮箱和密码以登录VV账号，如：/login testuser testpassword",
            );
        if (text.startsWith("/")) return;
        return bot.sendMessage(chatId, "未知命令，请使用 /help 获取帮助");
    },
);

bot.on(
    "callback_query",
    (query: TelegramBot.CallbackQuery): Promise<TelegramBot.Message> | undefined => {
        const message: TelegramBot.Message | null = query.message || null;
        if (!message) return;
        const chatId: number = message.chat.id;
        const data: string | undefined = query.data;
        if (data === "help") {
            return bot.sendMessage(
                chatId,
                "VV助手是一个Telegram机器人，可以帮助你查询用户信息。使用 /queryuser <用户ID> 来查询用户详情。例如：/queryuser 0\n输入 /help 以获取更多帮助",
            );
        } else {
            return bot.sendMessage(chatId, "未知操作");
        }
    },
);

// 接收群组消息
bot.on("group_chat_created", (msg: TelegramBot.Message, metadata: TelegramBot.Metadata): void => {
    console.log("Bot 被添加到新群组:", msg.chat.title);
});

bot.on("message", (msg: TelegramBot.Message, metadata: TelegramBot.Metadata): void => {
    // 判断消息来源
    if (msg.chat.type === "private") {
        console.log("私聊消息:", msg.text);
    } else if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        console.log("群组消息:", msg.text, "来自群组:", msg.chat.title);
    }
});

// 接收频道消息（Bot 需为频道管理员）
bot.on("channel_post", (msg: TelegramBot.Message): void => {
    console.log("频道消息:", msg.text, "来自频道:", msg.chat.title);
});

// 接收频道编辑消息
bot.on("edited_channel_post", (msg: TelegramBot.Message): void => {
    console.log("频道编辑消息:", msg.text);
});

console.log("Telegram Bot started.");

export default bot;
export { TelegramBot };
