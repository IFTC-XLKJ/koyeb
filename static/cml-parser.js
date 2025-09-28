// CML - 定制化标记语言
(async function() {
    const tags = [];
    globalThis.CMLParser = {};
    CMLParser.parser = function (CMLString) {
        // 将CML解析为HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(CMLString, "application/xml");
        console.log(doc);
        const mainNodes = doc.children;
        let html = "";
        for (let node in mainNodes) {}
        return html;
    }
    CMLParser.register = function(options) {
        // 注册CML标签
        const {
            cmlTagName,
            htmlTagName,
            handleFunc
        } = options;
        if (!htmlTagName.includes("-")) throw "HTML标签名必须包含-";
        const ascii = htmlTagName.charCodeAt(0);
        if (!ascii)
    }
})();
onload = () => {
    console.log(CMLParser.parser(`
<Text>114514</Text>
`));
}