Blockly.defineBlocksWithJsonArray([
    {
        type: 'function',
        message0: '函数 %1 %2',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: 'func'
            },
            {
                type: 'input_statement',
                name: 'STACK'
            }
        ],
        colour: 290,
        tooltip: '函数',
        helpUrl: '',
        nextStatement: true,
        previousStatement: true,
    },
    {
        type: 'function_call',
        message0: '调用函数 %1',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: 'func'
            }
        ],
        colour: 290,
        tooltip: '调用函数',
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