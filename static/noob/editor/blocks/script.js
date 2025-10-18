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
        inputInline: true
    },
    {
        type: "script_console_clear",
        message0: "清空控制台",
        args0: [],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        inputInline: true,
    },
    {
        type: "script_throw",
        message0: "抛出异常 %1 信息 %2",
        args0: [
            {
                type: "input_value",
                name: "type",
            },
            {
                type: "input_value",
                name: "content",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        tooltip: "抛出异常",
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
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        suppressPrefixSuffix: true,
        mutator: 'controls_if_mutator',
        extensions: ['controls_if_tooltip'],
        colour: "#68CDFF",
    },
    {
        type: 'controls_ifelse',
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
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        message2: '否则 %1',
        args2: [
            {
                type: 'input_statement',
                name: 'ELSE',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        suppressPrefixSuffix: true,
        extensions: ['controls_if_tooltip'],
        colour: "#68CDFF",
    },
    {
        type: 'controls_if_if',
        message0: '如果',
        nextStatement: null,
        colour: "#68CDFF",
        enableContextMenu: false,
    },
    {
        type: 'controls_if_elseif',
        message0: '否则如果',
        previousStatement: null,
        nextStatement: null,
        colour: "#68CDFF",
        enableContextMenu: false,
    },
    {
        type: 'controls_if_else',
        message0: '否则',
        previousStatement: null,
        colour: "#68CDFF",
        enableContextMenu: false,
    },
    {
        type: "script_void",
        message0: "执行 %1",
        args0: [
            {
                type: "input_value",
                name: "code",
            },
        ],
        nextStatement: null,
        previousStatement: null,
        colour: "#68CDFF",
        tooltip: "执行一段代码",
        inputInline: true,
    },
    {
        type: "window",
        message0: "全局变量",
        args0: [],
        colour: "#68CDFF",
        tooltip: "全局变量",
        inputInline: true,
        output: "Dictionary"
    },
    {
        type: "fetch",
        message0: "发送请求 方式%1 URL%2 请求头%3 请求体%4",
        args0: [
            {
                type: "field_dropdown",
                name: "method",
                options: [
                    ["GET", "GET"],
                    ["POST", "POST"],
                    ["PUT", "PUT"],
                    ["DELETE", "DELETE"],
                    ["PATCH", "PATCH"],
                    ["HEAD", "HEAD"],
                    ["OPTIONS", "OPTIONS"]
                ]
            },
            {
                type: "input_value",
                name: "url",
                check: "String"
            },
            {
                type: "input_value",
                name: "headers",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "body",
                check: "String"
            },
        ],
        output: "Dictionary",
        colour: "#68CDFF",
        tooltip: "发送一个HTTP请求，请求方式为GET、HEAD时没有请求体",
        inputInline: true,
    },
    {
        type: 'controls_repeat',
        message0: '%{BKY_CONTROLS_REPEAT_TITLE}',
        args0: [
            {
                type: 'input_value',
                name: 'TIMES',
            },
        ],
        message1: '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO',
            },
        ],
        colour: "#68CDFF",
        previousStatement: null,
        nextStatement: null,
        tooltip: '重复执行代码，谨慎使用，重复执行次数过多会导致主线程阻塞',
        helpUrl: '%{BKY_CONTROLS_REPEAT_HELPURL}',
    },
    {
        type: "annotation",
        message0: "注释 %1",
        args0: [
            {
                type: "field_input",
                name: "TEXT",
            },
        ],
        colour: "#68CDFF",
        tooltip: "注释",
        helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}",
        nextStatement: null,
        previousStatement: null,
    },
])

Blockly.JavaScript.forBlock['script_console'] = function (block) {
    const type = block.getFieldValue("type");
    const content = Blockly.JavaScript.valueToCode(block, 'content', Blockly.JavaScript.ORDER_ATOMIC);
    return `console.${type}(${content});\n`;
}

Blockly.JavaScript.forBlock['wait_for_seconds'] = function (block) {
    var seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC);
    return `await new Promise(resolve => setTimeout(resolve, ${seconds} * 1000));\n`;
}

Blockly.JavaScript.forBlock['script_try_catch_geterror'] = function (block) {
    return ['(try_catch_error)', Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

Blockly.JavaScript.forBlock['script_try_catch'] = function (block) {
    var try_block = Blockly.JavaScript.statementToCode(block, 'TRY');
    var catch_block = Blockly.JavaScript.statementToCode(block, 'CATCH_BLOCK');
    return `try {\n ${try_block} \n} catch (e) {\nconst try_catch_error = e;\n${catch_block} \n}\n`;
}

Blockly.JavaScript.forBlock['script_throw'] = function (block) {
    const type = Blockly.JavaScript.valueToCode(block, 'type', Blockly.JavaScript.ORDER_ATOMIC);
    const content = Blockly.JavaScript.valueToCode(block, 'content', Blockly.JavaScript.ORDER_ATOMIC);
    return `throw new Errors(${type}, ${content}, -1);\n`;
}

Blockly.JavaScript.forBlock["script_console_clear"] = function (block) {
    return `console.clear();\n`;
}

Blockly.JavaScript.forBlock["script_void"] = function (block) {
    const code = Blockly.JavaScript.valueToCode(block, 'code', Blockly.JavaScript.ORDER_ATOMIC);
    return `void ${code};\n`;
}

Blockly.JavaScript.forBlock["window"] = function (block) {
    return [`(window)`, Blockly.JavaScript.ORDER_NONE];
}

Blockly.JavaScript.forBlock["fetch"] = function (block) {
    const url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC);
    const method = block.getFieldValue('method');
    const headers = Blockly.JavaScript.valueToCode(block, 'headers', Blockly.JavaScript.ORDER_ATOMIC);
    const body = Blockly.JavaScript.valueToCode(block, 'body', Blockly.JavaScript.ORDER_ATOMIC);
    if (method == "GET" || method == "HEAD") {
        if (body.length != 2) {
            throw "GET和HEAD方法不能有请求体";
        }
    }
    return [`(await _fetch_(${url}, "${method}", ${headers}, ${body}))`, Blockly.JavaScript.ORDER_NONE];
}


Blockly.JavaScript.forBlock["controls_repeat"] = function (block) {
    const times = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '  ';
    const repeatVar = "repeat_" + Blockly.JavaScript.nameDB_.getDistinctName('i', Blockly.VARIABLE_CATEGORY_NAME);
    const code = `for (let ${repeatVar} = 0; ${repeatVar} < ${times}; ${repeatVar}++) {\n${branch}}\n`;
    // console.log(code);
    return code;
}