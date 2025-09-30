// CML - 定制化标记语言
(async function () {
    const tags = {};
    globalThis.CMLParser = {};
    CMLParser.parser = function (CMLString) {
        // 将CML解析为HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(CMLString, "text/xml");
        console.log(doc);
        const rootNodes = doc.children;
        console.log(rootNodes.length);
        if (rootNodes[0].tagName != "Article") throw "CML文档的根节点必须为 Article";
        const mainNodes = rootNodes[0].children;
        let html = "";
        new tags["Article"].tagClass();
        for (let node of mainNodes) {
            console.log(node, node.tagName);
            const tag = tags[node.tagName];
            if (!tag) throw "未注册名为 " + node.tagName + " 的标签";
            // 创建自定义元素
            const element = document.createElement(tag.htmlTagName);
            // 复制属性
            for (let attr of node.attributes) {
                element.setAttribute(attr.name, attr.value);
            }
            element.innerHTML = node.innerHTML;
            html += element.outerHTML;
        }
        return html;
    }
    CMLParser.register = function (options) {
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
        } catch (e) {
            if (e.message == `NotSupportedError: Failed to execute 'define' on 'CustomElementRegistry': the name "${htmlTagName}" has already been used with this registry`) throw htmlTagName + " 已被注册";
        }
        if (cmlTagName.includes(" ")) throw "CML标签中不允许有空格";
        tags[cmlTagName] = {
            htmlTagName,
            tagClass
        };
        return tags;
    }
    CMLParser.getTags = function () {
        return tags;
    }
})();
onload = () => {
    console.log(CMLParser.parser(`<Article>
        <Headline1>1级标题</Headline1>
        <Text>一段文本</Text>
        </Article>`));
}
(async function () {
    CMLParser.register({
        htmlTagName: "cml-article",
        cmlTagName: "Article",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                console.log("加载文章");
            }
        }
    });
    CMLParser.register({
        htmlTagName: "cml-text",
        cmlTagName: "Text",
        tagClass: class extends HTMLElement {}
    });
    CMLParser.register({
        htmlTagName: "cml-headline1",
        cmlTagName: "Headline1",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<h1 style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</h1>`
            }
        }
    });
})();