class 官方AI extends Ext {
    api = "https://api.chatanywhere.tech/v1/chat/completions";
    key = "sk-p43eRgJpYgCqweXqUQczzjfvc0d1DIqwq9hUU1kCuV2LNmJv";
    model = "gpt-3.5-turbo";
    systemPrompt =
        `（注意事项：回答格式为markdown；允许适当使用emoji）你是VV助手，你的唯一的主人是IFTC（中文全称叫星联科技集团），IFTC的网址是 [IFTC官网](iftc.koyeb.app)。
以下是IFTC的全部APP、服务、产品、技术等的列表：
1. VV图书（英文名是VVBooks）：一个使用HTML、CSS、JavaScript开发的网页套壳APP，它可以阅读书籍，用户也可创建自己的书籍，内置的论坛可以讨论交流，它还支持扩展功能，扩展可以丰富APP的内容，最新版的下载链接是 [test4-4](https://drive.moeres.cn/f/mqUp/VVBooks_test4-4.apk)。
2. VVMusic：这是一个免费听所有网易云音乐的网页，无需登录，可直接使用，体验链接是：https://iftc.koyeb.app/VVMusic。
`;
    historyId = Date.now();
    messages = [];
    constructor(name) {
        super(name);
        console.log("官方AI 扩展 准备就绪！");
    }
    async post(msg) {
        this.messages.push({
            role: "user",
            content: msg,
        });
        try {
            const response = await fetch(this.api, {
                method: "POST",
                headers: {
                    Authorization: `GitHub-Bearer ${this.key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    provider: "azureml",
                    temperature: 1.8,
                    top_p: 1,
                    messages: [{
                        role: "system",
                        content: this.systemPrompt,
                    }, ...this.messages],
                    stream: true,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }),
            });
            const responseClone = response.clone();
            try {
                const json = await response.json();
                if (json.error) {
                    console.error("官方AI：请求出错", json.error);
                    return;
                }
            } catch (e) { }
            const result0 = await responseClone.text();
            const result1 = result0.split("\n\n");
            const result = [];
            result1.forEach((item, index) => {
                if (item == "") return;
                if (item == "data: [DONE]") return;
                result[result.length] = JSON.parse(item.replace("data: ", ""));
            });
            console.log(result);
            let content = "";
            for (var i = 0; i < result.length; i++) {
                if (!result[i]["choices"][0]) continue;
                if (!result[i]["choices"][0]["delta"]["content"]) continue;
                content += result[i]["choices"][0]["delta"]["content"];
                console.log(content);
            }
            console.log(content);
            this.messages.push({
                role: "assistant",
                content: content,
            });
        } catch (e) {
            console.error("官方AI：请求出错", e);
        }
    }
    save() {
        this.saveFile("history/" + this.historyId + ".json", btoa(encodeURIComponent(JSON.stringify(this.messages))))
    }
    read() {
        return decodeURIComponent(atob(this.readFile("history/" + this.historyId + ".json")))
    }
}