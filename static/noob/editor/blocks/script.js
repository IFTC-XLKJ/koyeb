Blockly.defineBlocksWithJsonArray([
    {
        type: "script_console_log",
        message0: "控制台输出 %1",
        args0: [
            {
                type: "input_value",
                name: "CONSOLE_LOG",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "console.log",
        helpUrl: "",
        inputInline: true
    },
    {
        type: "script_console_warn",
        message0: "控制台警告 %1",
        args0: [
            {
                type: "input_value",
                name: "CONSOLE_WARN",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "console.warn",
        helpUrl: "",
        inputInline: true
    },
    {
        type: "script_console_error",
        message0: "控制台错误 %1",
        args0: [
            {
                type: "input_value",
                name: "CONSOLE_ERROR",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "console.error",
        helpUrl: "",
        inputInline: true
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
    }
])

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

Blockly.JavaScript.forBlock['script_console_error'] = function (block) {
    var console_error = Blockly.JavaScript.valueToCode(block, 'CONSOLE_ERROR', Blockly.JavaScript.ORDER_ATOMIC);
    return 'console.error(' + console_error + ');\n';
}

Blockly.JavaScript.forBlock['script_console_warn'] = function (block) {
    var console_warn = Blockly.JavaScript.valueToCode(block, 'CONSOLE_WARN', Blockly.JavaScript.ORDER_ATOMIC);
    return 'console.warn(' + console_warn + ');\n';
}

Blockly.JavaScript.forBlock['script_console_log'] = function (block) {
    var console_log = Blockly.JavaScript.valueToCode(block, 'CONSOLE_LOG', Blockly.JavaScript.ORDER_ATOMIC);
    return 'console.log(' + console_log + ');\n';
}