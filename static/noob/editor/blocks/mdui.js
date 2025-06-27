Blockly.defineBlocksWithJsonArray([
    {
        type: "mdui_theme",
        message0: "MDUI 主题 %1",
        arg0: [
            {
                type: "input_value",
                name: "THEME",
                check: "Dictionary",
                align: "RIGHT",
            }
        ],
        colour: "#4CAF50",
        tooltip: "设置 MDUI 主题",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_button",
    },
]);

Blockly.JavaScript.forBlock["mdui_theme"] = function (block) {
    const theme = Blockly.JavaScript.valueToCode(block, "THEME", Blockly.JavaScript.ORDER_ATOMIC);
    return `mdui.theme(${theme});\n`;
}