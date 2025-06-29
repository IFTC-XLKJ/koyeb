Blockly.defineBlocksWithJsonArray([
    {
        type: "get_document",
        message0: "获取文档",
        colour: "#9C004B",
        tooltip: "获取文档",
        helpUrl: "",
        output: "Dictionary",
    },
    {
        type: "get_document_element",
        message0: "获取元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true
    },
    {
        type: "get_document_elements",
        message0: "获取元素列表 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素列表",
        helpUrl: "",
        output: "Array",
        inputsInline: true
    },
    {
        type: "get_document_element_by_id",
        message0: "获取通过ID元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ID",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取通过ID元素",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true
    },
    {
        type: "get_document_element_by_class",
        message0: "获取通过类元素 %1",
        args0: [
            {
                type: "input_value",
                name: "CLASS",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取通过类元素",
        helpUrl: "",
        output: "Array",
        inputsInline: true
    },
    {
        type: "get_document_body",
        message0: "获取文档主体",
        colour: "#9C004B",
        tooltip: "获取文档主体",
        helpUrl: "",
        output: "Dictionary",
    },
    {
        type: "get_document_head",
        message0: "获取文档头部",
        colour: "#9C004B",
        tooltip: "获取文档头部",
        helpUrl: "",
        output: "Dictionary",
    },
    {
        type: "set_document_title",
        message0: "设置文档标题为 %1",
        args0: [
            {
                type: "input_value",
                name: "TITLE",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "设置文档标题",
        helpUrl: "",
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "get_document_title",
        message0: "获取文档标题",
        colour: "#9C004B",
        tooltip: "获取文档标题",
        helpUrl: "",
        output: "String",
    },
    {
        type: "get_element_attribute",
        message0: "获取 %1 的属性 %2",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素属性",
        helpUrl: "",
        output: "String",
        inputsInline: true
    },
    {
        type: "set_element_attribute",
        message0: "设置 %1 的属性 %2 为 %3",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "String"
            },
            {
                type: "input_value",
                name: "VALUE",
            }
        ],
        colour: "#9C004B",
        tooltip: "设置元素属性",
        helpUrl: "",
        previousStatement: null,
        nextStatement: null,
        inputsInline: true
    },
    {
        type: "get_element_style",
        message0: "获取 %1 的样式 %2",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "STYLE_PROPERTY",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素样式",
        helpUrl: "",
        output: "String",
        inputsInline: true
    },
    {
        type: "set_element_style",
        message0: "设置 %1 的样式 %2 为 %3",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "STYLE_PROPERTY",
                check: "String"
            },
            {
                type: "input_value",
                name: "VALUE",
            }
        ],
        colour: "#9C004B",
        tooltip: "设置元素样式",
        helpUrl: "",
        previousStatement: null,
        nextStatement: null,
        inputsInline: true
    },
    {
        type: "create_element",
        message0: "创建元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "创建元素",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true
    },
    {
        type: "append_child",
        message0: "添加子元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "Dictionary",
            }
        ],
        colour: "#9C004B",
        tooltip: "添加子元素",
        helpUrl: "",
        previousStatement: null,
        nextStatement: null,
        inputsInline: true
    },
])
Blockly.JavaScript.forBlock['get_document'] = function (block) {
    const code = '(document)';
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_element'] = function (block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `(document.querySelector(${element}))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_elements'] = function (block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `(document.querySelectorAll(${element}))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_element_by_id'] = function (block) {
    var id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `(document.getElementById(${id}))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_element_by_class'] = function (block) {
    var className = Blockly.JavaScript.valueToCode(block, 'CLASS', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `(document.getElementsByClassName(${className}))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_body'] = function (block) {
    var code = '(document.body)';
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_head'] = function (block) {
    var code = '(document.head)';
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['set_document_title'] = function (block) {
    var title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `document.title = ${title};\n`;
    return code;
}
Blockly.JavaScript.forBlock['get_document_title'] = function (block) {
    var code = '(document.title)';
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_element_attribute'] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    const attribute = Blockly.JavaScript.valueToCode(block, 'ATTRIBUTE', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `(${element}.getAttribute(${attribute}))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['set_element_attribute'] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    const attribute = Blockly.JavaScript.valueToCode(block, 'ATTRIBUTE', Blockly.JavaScript.ORDER_ATOMIC);
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `${element}.setAttribute(${attribute}, ${value});\n`;
    return code;
}
Blockly.JavaScript.forBlock['get_element_style'] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    const styleProperty = Blockly.JavaScript.valueToCode(block, 'STYLE_PROPERTY', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `(${element}.style[${styleProperty}])`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['set_element_style'] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    const styleProperty = Blockly.JavaScript.valueToCode(block, 'STYLE_PROPERTY', Blockly.JavaScript.ORDER_ATOMIC);
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `${element}.style[${styleProperty}] = ${value};\n`;
    return code;
}
Blockly.JavaScript.forBlock["create_element"] = function (block) {
    const element = block.getFieldValue("element");
    const code = `(document.createElement("${element}"))`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}