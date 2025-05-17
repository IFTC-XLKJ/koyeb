Blockly.defineBlocksWithJsonArray([
    {
        type: "vv_dragger",
        message0: "拖拽器 元素选择器%1",
        args0: [
            {
                type: "field_input",
                name: "selector",
                check: "String"
            }
        ],
        output: "String",
        colour: "#449CD6",
        tooltip: "拖拽器",
        helpUrl: "",
        inputsInline: true,
        nextStatement: true,
        previousStatement: true,
    }
]);

Blockly.JavaScript.forBlock["vv_dragger"] = function (block) {
    const selector = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_ATOMIC);
    return ``;
}