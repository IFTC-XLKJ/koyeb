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
        colour: 230,
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
        colour: 230,
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
        colour: 230,
        tooltip: "console.error",
        helpUrl: "",
        inputInline: true
    }
])

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