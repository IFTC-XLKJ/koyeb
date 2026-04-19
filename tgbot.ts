import TelegramBot from "node-telegram-bot-api";

console.log("Telegram Bot is starting...");

const token: string = "8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4";
const bot = new TelegramBot(token, {
    polling: true,
});

bot.on("message", (msg: TelegramBot.Message): void => {
    const chatId: number = msg.chat.id;
    console.log("Received message from chat ID", chatId, ":", msg.text);
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

console.log("Telegram Bot started.");

export default bot;
export { TelegramBot };
