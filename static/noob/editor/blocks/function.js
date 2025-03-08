Blockly.defineBlocksWithJsonArray([
    {
        type: 'function',
        message0: '函数 %1 %2',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: '函数'
            },
            {
                type: 'input_statement',
                name: 'STACK'
            }
        ],
        colour: "#F88767",
        tooltip: '函数',
        helpUrl: '',
        nextStatement: true,
        previousStatement: true,
    },
    {
        type: 'return',
        message0: '返回 %1',
        args0: [
            {
                type: 'input_value',
                name: 'VALUE',
            }
        ],
        colour: "#F88767",
        tooltip: '返回',
        helpUrl: '',
        previousStatement: true,
    },
    {
        type: 'function_call',
        message0: '调用函数 %1',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: '函数'
            }
        ],
        colour: "#F88767",
        tooltip: '调用函数',
        helpUrl: '',
        inputsInline: true
    },
    {
        type: 'function_return',
        message0: '调用函数 %1 并返回',
        args0: [
            {
                type: 'input_value',
                name: 'NAME',
                text: '函数'
            }
        ],
        colour: "#F88767",
        tooltip: '调用函数并返回',
        helpUrl: '',
        inputsInline: true,
        output: null,
    }
])
Blockly.JavaScript.forBlock['function'] = function (block) {
    var name = block.getFieldValue('NAME');
    var stack = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `function ${name}() {\n${stack}\n}\n`;
}
Blockly.JavaScript.forBlock['function_call'] = function (block) {
    var name = block.getFieldValue('NAME');
    return `${name}();\n`;
}
Blockly.JavaScript.forBlock['function_return'] = function (block) {
    var name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
    return `${name}();\n`;
}
Blockly.JavaScript.forBlock['return'] = function (block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
    return `return ${value};\n`;
}