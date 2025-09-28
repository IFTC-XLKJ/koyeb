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
            tagClass
        } = options;
        if (htmlTagName.includes(" ")) throw "HTML标签中不允许有空格";
        if (!htmlTagName.includes("-")) throw "HTML标签名必须包含-";
        const ascii = htmlTagName.charCodeAt(0);
        if (!((ascii > 65 && ascii < 91) || (ascii > 97 && ascii < 123))) throw "HTML标签首位必须为英文字母";
        if (tags[cmlTagName]) throw cmlTagName + " 已被注册";
        try {
            customElements.define(htmlTagName, tagClass);
        }catch(e) {
            if (e.message == `NotSupportedError: Failed to execute 'define' on 'CustomElementRegistry': the name "${htmlTagName}" has already been used with this registry`) throw htmlTagName + " 已被注册";
        }
        if (cmlTagName.includes(" ")) throw "CML标签中不允许有空格";
        tags[cmlTagName] = {
            htmlTagName,
            tagClass
        };
        return tags;
    }
    CMLParser.getTags = function() {
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
        htmlTagName: "cml-text",
        cmlTagName: "Text",
        tagClass: class extends HTMLElement {}
    });
})();