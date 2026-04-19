import TelegramBot from "node-telegram-bot-api";

const token: string = "8201224672:AAHd8id6qYF4_J-vi4t7mcrewLN9qa1gKv4";
const bot = new TelegramBot(token, {
    polling: true,
});

export default bot;
export { TelegramBot };