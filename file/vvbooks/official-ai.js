class 官方AI extends Ext {
    api = "https://api.chatanywhere.tech/v1/chat/completions";
    key = "sk-p43eRgJpYgCqweXqUQczzjfvc0d1DIqwq9hUU1kCuV2LNmJv";
    model = "gpt-3.5-turbo";
    systemPrompt = `你是VV助手`;
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
        }):
        try {
            const response = await fetch(this.api, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.key}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: "system",
                        content: this.systemPrompt,
                    }, ...this.messages],
                    stream: true,
                }),
            });
            const responseClone = response.clone();
            try {
                const json = await response.json();
                if (json.error) {
                    console.error("官方AI：请求出错", json.error);
                    return;
                }
            }catch(e) {}
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
            for (var i = 0;i < result.length;i++) {
                if (!result[i]["choices"][0]) continue;
                if (!result[i]["choices"][0]["delta"]["content"]) continue;
                content += result[i]["choices"][0]["delta"]["content"];
                console.log(content);
            }
            console.log(content);
            this.messages.push({
                role: "assistant",
                content: content,
            })
        } catch(e) {
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