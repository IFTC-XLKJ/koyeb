// CML - 定制化标记语言
(async function() {
    globalThis.CMLParser = {};
    CMLParser.parser = function (CMLString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(CMLString);
    }
})();