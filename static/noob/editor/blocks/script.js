Blockly.defineBlocksWithJsonArray([
    {
        type: "script_console",
        message0: "控制台 %1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "type",
                options: [
                    ["输出", "log"],
                    ["警告", "warn"],
                    ["错误", "error"],
                ],
            },
            {
                type: "input_value",
                name: "content",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "",
        helpUrl: "",
        inputInline: true
    },
    {
        type: ""
    },
    {
        type: "script_try_catch",
        message0: "尝试 %1 捕获 %2",
        args0: [
            {
                type: "input_statement",
                name: "TRY"
            },
            {
                type: "input_statement",
                name: "CATCH_BLOCK"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "try catch",
        helpUrl: "",
        inputInline: true
    },
    {
        type: "script_try_catch_geterror",
        message0: "获取捕获的错误变量",
        args0: [],
        output: "String",
        colour: "#68CDFF",
        tooltip: "获取捕获的错误变量",
        helpUrl: "",
        inputInline: true
    },
    {
        type: "wait_for_seconds",
        message0: "等待 %1 秒",
        args0: [
            {
                type: "input_value",
                name: "SECONDS",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "等待",
        helpUrl: "",
        inputInline: true
    },
    {
        type: 'controls_if',
        message0: '如果 %1',
        args0: [
            {
                type: 'input_value',
                name: 'IF0',
                check: 'Boolean',
            },
        ],
        message1: '%1',
        args1: [
            {
                'type': 'input_statement',
                'name': 'DO0',
            },
        ],
        'previousStatement': null,
        'nextStatement': null,
        'suppressPrefixSuffix': true,
        'mutator': 'controls_if_mutator',
        'extensions': ['controls_if_tooltip'],
        colour: "#68CDFF",
    },
])

Blockly.JavaScript.forBlock['script_console'] = function (block) {
    const type = block.getFieldValue("type");
    const content = Blockly.JavaScript.valueToCode(block, 'content', Blockly.JavaScript.ORDER_ATOMIC);
    return `console.${type}(${content})`;
}

Blockly.JavaScript.forBlock['wait_for_seconds'] = function (block) {
    var seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC);
    return `await new Promise(resolve => setTimeout(resolve, ${seconds} * 1000));\n`;
}

Blockly.JavaScript.forBlock['script_try_catch_geterror'] = function (block) {
    return ['try_catch_error', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

Blockly.JavaScript.forBlock['script_try_catch'] = function (block) {
    var try_block = Blockly.JavaScript.statementToCode(block, 'TRY');
    var catch_block = Blockly.JavaScript.statementToCode(block, 'CATCH_BLOCK');
    return `try {\n ${try_block} \n} catch (e) {\nconst try_catch_error = e;\n${catch_block} \n}`;
}