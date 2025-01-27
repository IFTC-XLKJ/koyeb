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
        colour: 20,
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
        colour: 20,
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
        colour: 20,
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
                    ["^", "**"]
                ]
            },
            {
                type: "input_value",
                name: "NUM1",
                check: "Number"
            }
        ],
        output: "Number",
        colour: 20,
        tooltip: "数字运算",
        helpUrl: "",
        inputsInline: true
    }
]);

Blockly.JavaScript.forBlock['num_operator'] = function (block) {
    var operator = block.getFieldValue('OP');
    var num0 = Blockly.JavaScript.valueToCode(block, 'NUM0', Blockly.JavaScript.ORDER_ATOMIC);
    var num1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ATOMIC);
    return ["(" + num0 + operator + num1 + ")", Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['text'] = function (block) {
    var text = block.getFieldValue('TEXT');
    return ['"' + text + '"', Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['text_join'] = function (block) {
    var text0 = Blockly.JavaScript.valueToCode(block, 'ADD0', Blockly.JavaScript.ORDER_ATOMIC);
    var text1 = Blockly.JavaScript.valueToCode(block, 'ADD1', Blockly.JavaScript.ORDER_ATOMIC);
    return ["(" + text0 + ' + ' + text1 + ")", Blockly.JavaScript.ORDER_ATOMIC];
}