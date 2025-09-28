// CML - 定制化标记语言
(async function() {
    const tags = [];
    globalThis.CMLParser = {};
    CMLParser.parser = function (CMLString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(CMLString, "application/xml");
        console.log(doc);
        const mainNodes = doc.children;
        for (let node in mainNodes) {}
        return doc;
    }
})();
console.log(CMLParser.parser('<Text>114514</Text>').querySelector('Text'))