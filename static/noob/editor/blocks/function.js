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
        message0: '调用函数 %1 传参 %2',
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
        message0: '调用函数 %1 传参 %2 并返回',
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
        tooltip: '调用函数并返回',
        helpUrl: '',
        inputsInline: true,
        output: null,
    },
    {
        type: 'function_var',
        message0: '%1',
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
        output: "Function",
    },
    {
        type: "temp_function",
        message0: "临时函数 参数列表 %2 %3",
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
        tooltip: '定义一个临时函数',
        helpUrl: '',
        output: null,
        inputsInline: true
    },
])
Blockly.JavaScript.forBlock['function'] = function (block) {
    var name = block.getFieldValue('NAME');
    const paramCode = functionParamHandler(Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]");
    var stack = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `globalThis.${name} = async function (${paramCode}) {\n${stack}\n}\n`;
}
Blockly.JavaScript.forBlock['function_param'] = function (block) {
    return [
        `funparam_${block.getFieldValue('NAME')}`,
        Blockly.JavaScript.ORDER_ATOMIC
    ];
};
Blockly.JavaScript.forBlock['function_call'] = function (block) {
    var name = block.getFieldValue('NAME');
    const paramCodeArray = funparamformatarray(
        Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]"
    );
    var paramCode = '';
    for (var i = 0; i < paramCodeArray.length; i++) {
        paramCode += `${paramCodeArray[i]}${i < paramCodeArray.length - 1 ? ', ' : ''}`;
    }
    return `await globalThis.${name}(${paramCode});\n`;
}
Blockly.JavaScript.forBlock['function_return'] = function (block) {
    var name = block.getFieldValue('NAME');
    const paramCodeArray = funparamformatarray(
        Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]"
    );
    var paramCode = '';
    for (var i = 0; i < paramCodeArray.length; i++) {
        paramCode += `${paramCodeArray[i]}${i < paramCodeArray.length - 1 ? ', ' : ''}`;
    }
    var code = `await globalThis.${name}(${paramCode})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript.forBlock['return'] = function (block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
    return `return ${value};\n`;
};

function functionParamHandler(param) {
    const paramCodeArray = funparamformatarray(param);
    var paramCode = '';
    for (var i = 0; i < paramCodeArray.length; i++) {
        if (paramCodeArray[i] == null || paramCodeArray[i] == undefined) {
            paramCodeArray[i] = '';
        }
        paramCodeArray[i] = String(paramCodeArray[i]).slice(1, -1);
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
    return paramCode;
}

function funparamformatarray(paramCode) {
    return paramCode.slice(1, -1).split(",");
}

Blockly.JavaScript.forBlock['function_var'] = function (block) {
    const name = block.getFieldValue('NAME');
    return [`(globalThis.${name})`, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.forBlock["temp_function"] = function (block) {
    const paramCode = functionParamHandler(Blockly.JavaScript.valueToCode(block, 'PARAM', Blockly.JavaScript.ORDER_NONE) || "[]");
    const code = Blockly.JavaScript.statementToCode(block, "DO");
    return `(async function (${paramCode}) {\n${code}\n})`;
};