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
        return doc;
    }
    CMLParser.register = function(options) {
        // 注册CML标签
        const {
            cmlTagName,
            htmlTagName,
            handleFunc
        } = options;
    }
})();
onload = () => {
    console.log(CMLParser.parser('<Text>114514</Text>').querySelector('Text'));
}