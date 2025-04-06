Blockly.defineBlocksWithJsonArray([
    {
        type: 'function',
        message0: '函数 %1 参数列表 %2 %3',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: '函数'
            },
            {
                type: 'input_value',
                name: 'PARAM',
                check: 'Array'
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
        type: 'function_param',
        message0: '参数 %1',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: '参数'
            }
        ],
        colour: "#F88767",
        tooltip: '参数',
        helpUrl: '',
        output: true,
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
        message0: '调用函数 %1 %2',
        args0: [
            {
                type: 'field_input',
                name: 'NAME',
                text: '函数'
            },
            {
                type: 'input_value',
                name: 'PARAM',
                check: 'Array'
            }
        ],
        colour: "#F88767",
        tooltip: '调用函数',
        helpUrl: '',
        inputsInline: true,
        nextStatement: true,
        previousStatement: true,
    },
    {
        type: 'function_return',
        message0: '调用函数 %1 并返回',
        args0: [
            {
                type: 'field_input',
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
    const paramCodeArray = JSON.parse(
        Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]"
    );
    var paramCode = '';
    for (var i = 0; i < paramCodeArray.length; i++) {
        if (paramCodeArray[i] == null || paramCodeArray[i] == undefined) {
            paramCodeArray[i] = '';
        }
        paramCodeArray[i] = String(paramCodeArray[i]);
        paramCode += `funparam_${paramCodeArray[i]
            .replaceAll(",", "_")
            .replaceAll("-", "_")
            .replaceAll(".", "_")
            .replaceAll("(", "_")
            .replaceAll(")", "_")
            .replaceAll("[", "_")
            .replaceAll("]", "_")
            .replaceAll("{", "_")
            .replaceAll("}", "_")
            .replaceAll("*", "_")
            .replaceAll("!", "_")
            .replaceAll("@", "_")
            .replaceAll("~", "_")
            .replaceAll("`", "_")
            .replaceAll("'", "_")
            .replaceAll("\"", "_")
            .replaceAll("#", "_")
            .replaceAll("$", "_")
            .replaceAll("%", "_")
            .replaceAll("^", "_")
            .replaceAll("&", "_")
            .replaceAll(";", "_")
            .replaceAll("/", "_")
            .replaceAll("\\", "_")
            .replaceAll("<", "_")
            .replaceAll(">", "_")
            .replaceAll("?", "_")
            .replaceAll("=", "_")
            .replaceAll("+", "_")
            .replaceAll("|", "_")}${i < paramCodeArray.length - 1 ? ', ' : ''}`;
    }
    var stack = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `async function ${name}(${paramCode}) {\n${stack}\n}\n`;
}
Blockly.JavaScript.forBlock['function_param'] = function (block) {
    return [
        `funparam_${block.getFieldValue('NAME')}`,
        Blockly.JavaScript.ORDER_ATOMIC
    ];
};
Blockly.JavaScript.forBlock['function_call'] = function (block) {
    var name = block.getFieldValue('NAME');
    const paramCodeArray = JSON.parse(
        Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]"
    );
    var paramCode = '';
    for (var i = 0; i < paramCodeArray.length; i++) {
        if (paramCodeArray[i] == null || paramCodeArray[i] == undefined) {
            paramCodeArray[i] = '';
        }
        paramCodeArray[i] = String(paramCodeArray[i]);
        paramCode += `${paramCodeArray[i]}${i < paramCodeArray.length- 1 ? ', ' : ''}`;
    }
    return `await ${name}(${paramCode});\n`;
}
Blockly.JavaScript.forBlock['function_return'] = function (block) {
    var name = block.getFieldValue('NAME');
    var code = `await ${name}()`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript.forBlock['return'] = function (block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
    return `return ${value};\n`;
};