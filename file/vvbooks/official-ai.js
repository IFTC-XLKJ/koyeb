class 官方AI extends Ext {
    api = "https://api.chatanywhere.tech/v1/chat/completions";
    key = "sk-p43eRgJpYgCqweXqUQczzjfvc0d1DIqwq9hUU1kCuV2LNmJv";
    model = "gpt-3.5-turbo";
    constructor(name) {
        super(name);
        console.log("官方AI 扩展 准备就绪！");
    }
    async post() {
        try {
            const response = await fetch(this.api, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.key}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [],
                    stream: true,
                }),
            });
        } catch(e) {}
    }
}