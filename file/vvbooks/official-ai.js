class 官方AI extends Ext {
    api = "https://models.github.ai/inference/chat/completions";
    key = "2JboLre4P4m2AWbk_rVSfLWxRtCMe9joOOkciisuVo3fVvLgkY4te28Gobb--HwK2AukpsjmL9lqWHgtv1V5MgdhC_0aXZ909CM6GQkoj9A=";
    model = "openai/gpt-4.1-mini";
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
                    temperature: 1,
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