// CML - 定制化标记语言
(async function() {
    const tags = {};
    globalThis.CMLParser = {};
    CMLParser.parser = function (CMLString) {
        // 将CML解析为HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(CMLString, "text/xml");
        console.log(doc);
        const mainNodes = doc.children;
        console.log(mainNodes.length);
        let html = "";
        for (let node of mainNodes) {
            console.log(node, node.tagName);
            const tag = tags[node.tagName];
            if (!tag) throw "未注册名为 " + node.tagName + " 的标签";
        }
        return html;
    }
    CMLParser.register = function(options) {
        // 注册CML标签
        const {
            cmlTagName,
            htmlTagName,
            handleFunc
        } = options;
        if (htmlTagName.includes(" ")) throw "HTML标签中不允许有空格";
        if (!htmlTagName.includes("-")) throw "HTML标签名必须包含-";
        const ascii = htmlTagName.charCodeAt(0);
        if ((ascii > 65 && ascii < 91) || (ascii > 97 && ascii < 123)) throw "HTML标签首位必须为英文字母";
        if (cmlTagName.includes(" ")) throw "CML标签中不允许有空格";
        tags[cmlTagName] = {
            htmlTagName,
            handleFunc
        };
        customElements.define(htmlTagName, handleFunc);
        return tags;
    }
})();
onload = () => {
    console.log(CMLParser.parser(`
<Text>114514</Text>
`));
}
(async function() {
    CMLParser.register({
        htmlTagName
    });
})();