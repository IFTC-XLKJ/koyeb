class 官方AI extends Ext {
    api = "https://api.chatanywhere.tech/v1/chat/completions";
    key = "sk-p43eRgJpYgCqweXqUQczzjfvc0d1DIqwq9hUU1kCuV2LNmJv";
    model = "gpt-3.5-turbo";
    systemPrompt = `你是`;
    constructor(name) {
        super(name);
        console.log("官方AI 扩展 准备就绪！");
    }
    async post() {
        const messages = [];
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
                    }, ...messages],
                    stream: true,
                }),
            });
            const json = await response.json();
            if (json.error) {
                console.error("官方AI：请求出错", json.error);
                return;
            }
            console.log(json)
        } catch(e) {
            console.error("官方AI：请求出错", e);
        }
    }
}