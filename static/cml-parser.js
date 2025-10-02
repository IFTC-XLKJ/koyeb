// CML - 定制化标记语言
// Customization Markup Language
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
    function capitalize(str) {
        if (!str || typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function changeTag(element, newTagName) {
        const newElement = document.createElement(newTagName);
        for (let attr of element.attributes) {
            newElement.setAttribute(attr.name, attr.value);
        }
        newElement.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }
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
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({
                    mode: 'open'
                });
                this.shadowRoot.innerHTML = `<span></span>`;
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;
                if (name == "color") {
                    this.shadowRoot.querySelector("span").style.color = newValue;
                } else if (name == "bgcolor") {
                    this.shadowRoot.querySelector("span").style.backgroundColor = newValue;
                }
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<span style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</span>`;
            }
        }
    });
    CMLParser.register({
        htmlTagName: "cml-headline1",
        cmlTagName: "Headline1",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({
                    mode: 'open'
                });
                this.shadowRoot.innerHTML = `<h1></h1>`;
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;
                if (name == "color") {
                    this.shadowRoot.querySelector("h1").style.color = newValue;
                } else if (name == "bgcolor") {
                    this.shadowRoot.querySelector("h1").style.backgroundColor = newValue;
                }
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<h1 style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</h1>`
            }
        }
    });
    CMLParser.register({
        htmlTagName: "cml-headline2",
        cmlTagName: "Headline2",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({
                    mode: 'open'
                });
                this.shadowRoot.innerHTML = `<h2></h2>`;
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;
                if (name == "color") {
                    this.shadowRoot.querySelector("h2").style.color = newValue;
                } else if (name == "bgcolor") {
                    this.shadowRoot.querySelector("h2").style.backgroundColor = newValue;
                }
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<h2 style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</h2>`
            }
        }
    });
    CMLParser.register({
        htmlTagName: "cml-headline3",
        cmlTagName: "Headline3",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({
                    mode: 'open'
                });
                this.shadowRoot.innerHTML = `<h3></h3>`;
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;
                if (name == "color") {
                    this.shadowRoot.querySelector("h3").style.color = newValue;
                } else if (name == "bgcolor") {
                    this.shadowRoot.querySelector("h3").style.backgroundColor = newValue;
                }
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<h3 style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</h3>`
            }
        }
    });
    CMLParser.register({
        htmlTagName: "cml-paragraph",
        cmlTagName: "Paragraph",
        tagClass: class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({
                    mode: 'open'
                });
                this.shadowRoot.innerHTML = `<p></p>`;
                const config = {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeOldValue: true,
                    characterData: true,
                    characterDataOldValue: true
                };
                const that = this;
                const observer = new MutationObserver(function (mutationsList, observer) {
                    for (let mutation of mutationsList) {
                        console.log(mutation.type);
                        if (mutation.type === 'childList') {
                            console.log('子节点发生了变化：', mutation);
                            // console.log(that.innerHTML);
                            for (let node of mutation.addedNodes) {
                                if (node instanceof Element) {
                                    console.log(node);
                                    if (CMLParser.getTags()[capitalize(node.tagName.toLowerCase())]) {
                                        changeTag(node, CMLParser.getTags()[capitalize(node.tagName.toLowerCase())].htmlTagName);
                                    } 
                                    // else {
                                    //     throw "不允许在 Paragraph 中使用未注册的标签：" + capitalize(node.tagName.toLowerCase());
                                    // }
                                }
                            }
                            for (let node of mutation.removedNodes) {
                                console.log(node instanceof Element);
                            }
                        }
                        else if (mutation.type === 'attributes') {
                            console.log(`属性 ${mutation.attributeName} 发生了变化`);
                            // 例如，元素的 class, id, style 等属性被修改
                        }
                        else if (mutation.type === 'subtree') {
                            console.log('子树发生了变化');
                            // 配合 subtree: true 选项，监听后代节点
                        }
                    }
                });
                observer.observe(this, config);
            }
            static get observedAttributes() {
                return ["color", "bgcolor"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;
                if (name == "color") {
                    this.shadowRoot.querySelector("p").style.color = newValue;
                } else if (name == "bgcolor") {
                    this.shadowRoot.querySelector("p").style.backgroundColor = newValue;
                }
            }
            connectedCallback() {
                this.shadowRoot.innerHTML = `<p style="color: ${this.getAttribute("color") || "black"};background-color: ${this.getAttribute("bgcolor") || "#FFFFFF00"};">${this.innerText}</p>`
            }
        }
    })
})();