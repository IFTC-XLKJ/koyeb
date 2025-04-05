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
        inputsInline: true,
        nextStatement: true,
        previousStatement: true,
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
    var param = JSON.parse(Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]");
    console.log(param);
    var paramCode = '';
    for (var i = 0; i < param.length; i++) {
        if (param[i] == null || param[i] == undefined) {
            param[i] = '';
        }
        param[i] = String(param[i]);
        paramCode += `funparam_${param[i]
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
            .replaceAll("|", "_")}${i < param.length - 1 ? ', ' : ''}`;
    }
    var stack = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `async function ${name}(${paramCode}) {\n${stack}\n}\n`;
}
Blockly.JavaScript.forBlock['function_param'] = function (block) {
    var name = block.getFieldValue('NAME');
    return `funparam_${name}`;
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
    var name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
    return `return ${name};\n`;
}