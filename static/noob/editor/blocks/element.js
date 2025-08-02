const mdui_theme_set_code = `globalThis.mduiThemes = {};
globalThis.mduiTheme = function (theme) {
    const themeKeys = Object.keys(theme);
    for (let i = 0; i < themeKeys.length; i++) {
        const key = themeKeys[i];
        mduiThemes[key] = theme[key];
    }
    const themesKeys = Object.keys(mduiThemes);
    let styleText = ":root {\\n";
    for (let i = 0; i < themesKeys.length; i++) {
        const key = themesKeys[i];
        const value = mduiThemes[key];
        styleText += \`    \${key}: \${value};\\n\`;
    }
    styleText += "}\\n";
    const style = document.querySelector('style[iftc-mdui="theme"]');
    if (style) {
        style.textContent = styleText;
    }
}
mduiTheme({}); // 初始化主题`;
// 文档类型
Blockly.Blocks['doc_type'] = {
    init: function () {
        this.setNextStatement(true);
        this.appendDummyInput()
            .appendField('文档类型')
            .appendField(new Blockly.FieldDropdown([
                ['HTML', 'html'],
                ['HTML5', 'html5'],
                ['XHTML 1.0 过渡', 'xhtml1-transitional'],
                ['HTML 4.01 过渡', 'html4-transitional']
            ]), 'DOCTYPE');
        this.setOutput(false, "String");
        this.setColour("#449CD6");
        this.setMovable(false);
        this.setDeletable(false);
        this.setTooltip("文档类型声明，用于声明文档的版本和类型")
    }
};
Blockly.JavaScript.forBlock['doc_type'] = function (block) {
    var doctype = block.getFieldValue('DOCTYPE');
    var code = `<!DOCTYPE ${doctype}>\n`;
    return code;
};
// 页面
Blockly.Blocks['element_html'] = {
    init: function () {
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('页面')
        this.appendStatementInput('html')
            .appendField('');
        this.setOutput(false, "String");
        this.setColour("#449CD6");
        this.setMovable(false);
        this.setDeletable(false);
        this.setTooltip("网页的根元素，包含头部和主体")
    }
};
Blockly.JavaScript.forBlock['element_html'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<html>\n${html}</html>\n`;
    return code;
}
// 头部
Blockly.Blocks['element_head'] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('头部')
        this.appendStatementInput('html')
            .appendField('')
        this.setOutput(false, "String");
        this.setColour("#449CD6");
        this.setMovable(false);
        this.setDeletable(false);
        this.setTooltip("网页头部部分（元数据部分）")
    }
};
Blockly.JavaScript.forBlock['element_head'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<head iftc-annotation="NOOB编辑器">\n<style>:root { user-select: none; }</style>\n<script>class Errors extends Error { constructor(type, message, errorCode) {super(message);this.name = type;this.errorCode = errorCode || 0}}</script>\n<link rel="stylesheet" href="https://iftc.koyeb.app/static/md3.css">\n<style iftc-mdui="theme"></style>\n<script src="https://iftc.koyeb.app/static/md3.js"></script>\n<script>${mdui_theme_set_code}</script>\n<script>async function _fetch_(url, method, headers, body) {
    try {
        const r = await fetch(url, {
            method: method,
            headers: headers,
            body: body || void 0
        })
        const t = await r.text();
        return { code: r.status, msg: r.statusText, data: t, ok: r.ok };
    } catch(e) {
        return { code: 0, msg: e.message, data: null, ok: false };
    }
}
globalThis.undefined = void 0;</script>\n<script>const Exts = {};${getExts()}</script>\n<script src="https://iftc.koyeb.app/file/component/Dragger.js"></script>${html}</head>\n`;
    return code;
    function getExts() {
        let code = "";
        const keys = Object.keys(Exts);
        keys.forEach(key => {
            // console.log(Exts[key].toLocaleString());
            code += `Exts["${key}"] = ${Exts[key].toLocaleString()};`
        })
        return code;
    }
}
// 主体
Blockly.Blocks['element_body'] = {
    init: function () {
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('主体')
        this.appendStatementInput('html')
            .appendField('');
        this.setOutput(false, "String");
        this.setColour("#449CD6");
        this.setMovable(false);
        this.setDeletable(false);
        this.setTooltip("网页主体部分（UI部分）")
    }
};
Blockly.JavaScript.forBlock['element_body'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<body>\n${html}</body>\n`;
    return code;
}
// 标题
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_title",
        message0: "标题 %1",
        args0: [
            {
                type: "field_input",
                name: "TITLE",
                text: "Document"
            }
        ],
        colour: "#449CD6",
        tooltip: "网页的标题，可动态设置",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
    }
]);
Blockly.JavaScript.forBlock['element_title'] = function (block) {
    var title = block.getFieldValue('TITLE');
    if (!title) {
        title = '';
    }
    var code = `<title>${title}</title>\n`;
    return code;
};
// 文档编码
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_charset",
        message0: "编码 %1",
        args0: [
            {
                type: "field_input",
                name: "CHARSET",
                text: "utf-8"
            }
        ],
        colour: "#449CD6",
        tooltip: "建议设置为utf-8，不设置容易乱码",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
    }
])
Blockly.JavaScript.forBlock['element_charset'] = function (block) {
    var charset = block.getFieldValue('CHARSET');
    var code = `<meta charset="${charset}">\n`;
    return code;
};
// 元数据
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_meta",
        message0: "元数据 名称 %1 内容 %2",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "description"
            },
            {
                type: "field_input",
                name: "CONTENT",
                text: "IFTC"
            }
        ],
        colour: "#449CD6",
        tooltip: "meta 标签",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
    }
]);
Blockly.JavaScript.forBlock['element_meta'] = function (block) {
    var name = block.getFieldValue('NAME');
    var content = block.getFieldValue('CONTENT');
    var code = `<meta name="${name}" content="${content}">\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_link",
        message0: "链接 关系 %1 URL %2",
        args0: [
            {
                type: "field_input",
                name: "REL",
                text: "icon"
            },
            {
                type: "field_input",
                name: "URL",
                text: "https://iftc.koyeb.app/favicon.ico"
            }
        ],
        colour: "#449CD6",
        tooltip: "link 标签",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_link'] = function (block) {
    var rel = block.getFieldValue('REL');
    var url = block.getFieldValue('URL');
    var code = `<link rel="${rel}" href="${url}">\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_style",
        message0: "样式 %1",
        args0: [
            {
                type: "input_statement",
                name: "STYLESHEET",
            }
        ],
        colour: "#449CD6",
        tooltip: "style 标签",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_style'] = function (block) {
    var stylesheet = Blockly.JavaScript.statementToCode(block, 'STYLESHEET');
    var code = `<style>\n${stylesheet}</style>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_script",
        message0: "脚本 外部资源%1 %2",
        args0: [
            {
                type: "field_input",
                name: "SRC",
                text: ""
            },
            {
                type: "input_statement",
                name: "SCRIPT",
            }
        ],
        colour: "#449CD6",
        tooltip: "script 标签",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_script'] = function (block) {
    const src = block.getFieldValue('SRC');
    const script = Blockly.JavaScript.statementToCode(block, 'SCRIPT');
    const code = `<script${src.trim() ? `src="${src}"` : ""}>(async function() {\n${script}\n})();</script>\n`;
    return code;
};
// h1-h6 标签
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_h",
        message0: "标题 %1 级 内容 %2 属性 %3 样式 %4",
        args0: [
            {
                type: "field_number",
                name: "LEVEL",
                value: 1,
                min: 1,
                max: 6
            },
            {
                type: "field_input",
                name: "CONTENT",
                text: "标题"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            }
        ],
        colour: "#449CD6",
        tooltip: "大标题",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_h'] = function (block) {
    var level = block.getFieldValue('LEVEL');
    var content = block.getFieldValue('CONTENT');
    var code = `<h${level}${handleAttrAndStyle(block)}>${content}</h${level}>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_p",
        message0: "段落 内容 %1 属性 %2 样式 %3",
        args0: [
            {
                type: "field_input",
                name: "CONTENT",
                text: "段落"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            }
        ],
        colour: "#449CD6",
        tooltip: "段落",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_p'] = function (block) {
    var content = block.getFieldValue('CONTENT');
    var code = `<p${handleAttrAndStyle(block)}>${content}</p>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_div",
        message0: "块级元素 属性 %1 样式 %2 内容 %3",
        args0: [
            {
                type: "input_value",
                name: "ATTRIBUTE",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            },
            {
                type: "input_statement",
                name: "CONTENT",
                text: "块级元素"
            },
        ],
        colour: "#449CD6",
        tooltip: "块级元素",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_div'] = function (block) {
    var content = Blockly.JavaScript.statementToCode(block, 'CONTENT')
    var code = `<div${handleAttrAndStyle(block)}>${content}</div>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_span",
        message0: "行内元素 内容 %1 属性 %2 样式 %3",
        args0: [
            {
                type: "field_input",
                name: "CONTENT",
                text: "行内元素"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            },
        ],
        colour: "#449CD6",
        tooltip: "行内元素",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_span'] = function (block) {
    var content = block.getFieldValue('CONTENT');
    var code = `<span${handleAttrAndStyle(block)}>${content}</span>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_img",
        message0: "图片 URL %1 属性 %2 样式 %3",
        args0: [
            {
                type: "field_input",
                name: "URL",
                text: "https://iftc.koyeb.app/static/favicon.jpg"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            }
        ],
        colour: "#449CD6",
        tooltip: "图片",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_img'] = function (block) {
    var url = block.getFieldValue('URL');
    var code = `<img src="${url}"${handleAttrAndStyle(block)}>`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_a",
        message0: "超链接 URL %1 内容 %2 属性 %3 样式 %4",
        args0: [
            {
                type: "field_input",
                name: "URL",
                text: "https://iftc.koyeb.app"
            },
            {
                type: "field_input",
                name: "CONTENT",
                text: "超链接"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            }
        ],
        colour: "#449CD6",
        tooltip: "超链接",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_a'] = function (block) {
    var url = block.getFieldValue('URL');
    var content = block.getFieldValue('CONTENT');
    var code = `<a href="https://iftc.koyeb.app/safejump?page=${new URL(url, location.href).href}"${handleAttrAndStyle(block)}>${content}</a>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_br",
        message0: "换行",
        colour: "#449CD6",
        tooltip: "换行",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    }
])
Blockly.JavaScript.forBlock['element_br'] = function (block) {
    var code = `<br>\n`;
    return code;
};
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_hr",
        message0: "水平线 属性 %1 样式 %2",
        args0: [
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
            }
        ],
        colour: "#449CD6",
        tooltip: "水平线",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    },
    {
        type: "viewport_default",
        message0: "视图 自适应设备 缩放%1",
        args0: [
            {
                type: "field_checkbox",
                name: "SCALE",
                checked: true,
            },
        ],
        colour: "#449CD6",
        tooltip: "视图",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
    },
])
Blockly.JavaScript.forBlock['element_hr'] = function (block) {
    var code = `<hr${handleAttrAndStyle(block)}>\n`;
    return code;
};

Blockly.JavaScript.forBlock['viewport_default'] = function (block) {
    const scale = block.getFieldValue('SCALE') == "TRUE";
    const code = `<meta name="viewport" content="width=device-width, initial-scale=1.0${!scale ? `, user-scalable=no` : ""}">\n`;
    return code;
};

function handleAttrAndStyle(block) {
    var attribute = Blockly.JavaScript.valueToCode(block, 'ATTRIBUTE', Blockly.JavaScript.ORDER_ATOMIC);
    let attributes = "";
    if (attribute) {
        try {
            attribute = JSON.parse(attribute);
            for (var key in attribute) {
                attributes += ` ${key}="${attribute[key]}"`;
            }
        } catch (e) {
            const previewFrame = document.getElementById("previewFrame");
            previewFrame.srcdoc = `<div style="color:red;">${e}</div>`
        }
    }
    var style = Blockly.JavaScript.valueToCode(block, 'STYLE', Blockly.JavaScript.ORDER_ATOMIC);
    if (style) {
        try {
            style = JSON.parse(style);
            let styles = "";
            for (var key in style) {
                styles += `${key}:${style[key]};`;
            }
            attributes += ` style="${styles}"`;
        } catch (e) {
            const previewFrame = document.getElementById("previewFrame");
            previewFrame.srcdoc = `<div style="color:red;">${e}</div>`
        }
    }
    return attributes;
}