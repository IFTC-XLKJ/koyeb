Blockly.defineBlocksWithJsonArray([
    {
        type: "variables_define",
        message0: "定义变量 %1 %2",
        args0: [
            {
                type: "field_input",
                name: "VARIABLE",
                text: "变量"
            },
            {
                type: "input_value",
                name: "VALUE",
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        tooltip: "定义变量",
        helpUrl: "",
        colour: "#FDBA54",
    },
    {
        type: "variables_get",
        message0: "变量 %1",
        args0: [
            {
                type: "field_input",
                name: "VARIABLE",
                text: "变量"
            }
        ],
        inputsInline: true,
        output: null,
        tooltip: "获取变量",
        helpUrl: "",
        colour: "#FDBA54",
    },
    {
        type: "variables_set",
        message0: "设置变量 %1 为 %2",
        args0: [
            {
                type: "field_input",
                name: "VARIABLE",
                text: "变量"
            },
            {
                type: "input_value",
                name: "VALUE",
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        tooltip: "设置变量",
        helpUrl: "",
        colour: "#FDBA54",
    },
    {
        type: "variables_get_dynamic",
        message0: "变量 %1",
        args0: [
            {
                type: "field_input",
                name: "VARIABLE",
                text: "变量"
            }
        ],
    }
])

Blockly.JavaScript.forBlocks["variables_define"] = function (block) {
    var variable = Blockly.JavaScript.variableDB_.getName(block.getFieldValue("VARIABLE"), Blockly.Variables.NAME_TYPE);
    var value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC) || "0";
    var code = "let " + variable + " = " + value + ";\n";
    return code;
}