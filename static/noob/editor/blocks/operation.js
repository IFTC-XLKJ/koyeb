Blockly.defineBlocksWithJsonArray([
    {
        type: "math_number",
        message0: "%1",
        args0: [
            {
                type: "field_number",
                name: "NUM",
                value: 0
            }
        ],
        output: "Number",
        colour: "#F8AA87",
        tooltip: "数字",
        helpUrl: ""
    },
    {
        type: "text",
        message0: "“%1”",
        args0: [
            {
                type: "field_input",
                name: "TEXT",
                text: ""
            }
        ],
        output: "String",
        colour: "#F8AA87",
        tooltip: "文本",
        helpUrl: ""
    },
    {
        type: "text_join",
        message0: "%1 + %2",
        args0: [
            {
                type: "input_value",
                name: "ADD0",
            },
            {
                type: "input_value",
                name: "ADD1",
            }
        ],
        output: "String",
        colour: "#F8AA87",
        tooltip: "拼接文本",
        helpUrl: "",
        inputsInline: true
    },
    {
        type: "num_operator",
        message0: "%1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "NUM0",
                check: "Number"
            },
            {
                type: "field_dropdown",
                name: "OP",
                options: [
                    ["+", "+"],
                    ["-", "-"],
                    ["×", "*"],
                    ["÷", "/"],
                    ["%", "%"],
                    ["^", "**"],
                ]
            },
            {
                type: "input_value",
                name: "NUM1",
                check: "Number"
            }
        ],
        output: "Number",
        colour: "#F8AA87",
        tooltip: "数字运算",
        helpUrl: "",
        inputsInline: true
    },
    {
        type: "boolean",
        message0: "%1",
        args0: [
            {
                type: "field_dropdown",
                name: "Boolean",
                options: [
                    ["成立", "true"],
                    ["不成立", "false"],
                ],
            }
        ],
        output: "Boolean",
        colour: "#F8AA87",
        inputsInline: true
    },
    {
        type: 'negate',
        message0: '对 %1 取反',
        args0: [
            {
                type: 'input_value',
                name: 'BOOL',
                check: 'Boolean',
            },
        ],
        colour: '#F8AA87',
        inputInline: true,
        output: 'Boolean',
        tooltip: '对布尔值取反',
        helpUrl: '',
    },
    {
        type: "type_of",
        message0: "%1 的数据类型",
        args0: [
            {
                type: "input_value",
                name: "VALUE",
            },
        ],
        output: "String",
        colour: "#F8AA87",
        tooltip: "数据类型",
        helpUrl: "",
        inputsInline: true
    },
    {
        type: "undefined",
        message0: "未定义",
        args0: [],
        inputsInline: true,
        output: null,
        colour: "#F8AA87",
        tooltip: "未定义",
        helpUrl: "",
        inputsInline: true
    },
    {
        type: "null",
        message0: "空值",
        args0: [],
        inputsInline: true,
        output: null,
        colour: "#F8AA87",
        tooltip: "空值",
        helpUrl: "",
        inputsInline: true
    },
]);

Blockly.JavaScript.forBlock['num_operator'] = function (block) {
    var operator = block.getFieldValue('OP');
    var num0 = Blockly.JavaScript.valueToCode(block, 'NUM0', Blockly.JavaScript.ORDER_ATOMIC);
    var num1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ATOMIC);
    return [`(${num0} ${operator} ${num1})`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['text'] = function (block) {
    var text = block.getFieldValue('TEXT');
    return [`\"${text}\"`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['text_join'] = function (block) {
    var text0 = Blockly.JavaScript.valueToCode(block, 'ADD0', Blockly.JavaScript.ORDER_ATOMIC);
    var text1 = Blockly.JavaScript.valueToCode(block, 'ADD1', Blockly.JavaScript.ORDER_ATOMIC);
    return [`(${text0} + ${text1})`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock["boolean"] = function (block) {
    const boolean = block.getFieldValue("Boolean");
    return [`(${boolean})`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['negate'] = function (block) {
    const bool = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_ATOMIC);
    return [`(!${bool})`, Blockly.JavaScript.ORDER_LOGICAL_NOT];
}

Blockly.JavaScript.forBlock['type_of'] = function (block) {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return [`(typeof ${value})`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['null'] = function (block) {
    return ["null", Blockly.JavaScript.ORDER_NONE];
}